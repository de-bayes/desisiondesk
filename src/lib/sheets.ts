import { type CallerGrade, callerColors } from "@/lib/data";

const SHEET_ID = "1UgoMROR2bpH_QUZnvV0yZNd4St90DxlQWB1AToVEU-8";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

export interface SheetRace {
  race: string;
  state: string;
  category: string;
  date: string;
  pollsClose: string;
  times: { caller: string; minutes: number; link: string | null }[];
}

function parseCSVRow(row: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function diffMinutes(pollsClose: string, callTime: string): number | null {
  if (!pollsClose || !callTime) return null;
  try {
    const pc = new Date(pollsClose).getTime();
    const ct = new Date(callTime).getTime();
    if (isNaN(pc) || isNaN(ct)) return null;
    const diff = (ct - pc) / 60000;
    return Math.max(0, Math.round(diff * 10) / 10);
  } catch {
    return null;
  }
}

export async function fetchSheetRaces(): Promise<SheetRace[]> {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: 300 } }); // cache 5 min
    const text = await res.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];

    const rows = lines.slice(1); // skip header

    return rows
      .map((row) => {
        const f = parseCSVRow(row);
        // RACE, State, COMP, Date, Polls Close, AP CALL, AP LINK, VH CALL, VH LINK, DDHQ CALL, DDHQ LINK
        const race = f[0] || "";
        const state = f[1] || "";
        const category = f[2] || "";
        const date = f[3] || "";
        const pollsClose = f[4] || "";
        const apCall = f[5] || "";
        const apLink = f[6] || "";
        const vhCall = f[7] || "";
        const vhLink = f[8] || "";
        const ddhqCall = f[9] || "";
        const ddhqLink = f[10] || "";

        if (!race) return null;

        const times: SheetRace["times"] = [];

        const vhMin = diffMinutes(pollsClose, vhCall);
        if (vhMin !== null) times.push({ caller: "VoteHub", minutes: vhMin, link: vhLink || null });

        const ddhqMin = diffMinutes(pollsClose, ddhqCall);
        if (ddhqMin !== null) times.push({ caller: "DDHQ", minutes: ddhqMin, link: ddhqLink || null });

        const apMin = diffMinutes(pollsClose, apCall);
        if (apMin !== null) times.push({ caller: "AP", minutes: apMin, link: apLink || null });

        times.sort((a, b) => a.minutes - b.minutes);

        return { race, state, category, date, pollsClose, times };
      })
      .filter((r): r is SheetRace => r !== null);
  } catch {
    return [];
  }
}

// Normalize category strings from the sheet
function normalizeCategory(raw: string): "precall" | "strong" | "tossup" | null {
  const s = raw.toLowerCase().trim();
  if (s.includes("pre") || s.includes("safe") || s.includes("uncontested")) return "precall";
  if (s.includes("strong") || s.includes("lean")) return "strong";
  if (s.includes("toss") || s.includes("competitive")) return "tossup";
  return null;
}

const CALLER_META: Record<string, { id: string; name: string; shortName: string; color: string }> = {
  VoteHub: { id: "votehub", name: "VoteHub", shortName: "VH", color: callerColors.votehub },
  DDHQ: { id: "ddhq", name: "Decision Desk HQ", shortName: "DDHQ", color: callerColors.ddhq },
  AP: { id: "ap", name: "Associated Press", shortName: "AP", color: callerColors.ap },
};

export function computeGradesFromSheet(races: SheetRace[]): CallerGrade[] | null {
  if (races.length === 0) return null;

  const callerNames = ["VoteHub", "DDHQ", "AP"];
  const results: CallerGrade[] = [];

  for (const callerName of callerNames) {
    const meta = CALLER_META[callerName];
    const precallTimes: number[] = [];
    const strongTimes: number[] = [];
    const tossupTimes: number[] = [];
    const allTimes: number[] = [];
    let firstCalls = 0;
    let totalRacesWithCaller = 0;
    let incorrectCalls = 0;

    for (const race of races) {
      const cat = normalizeCategory(race.category);
      if (!cat) continue;

      const callerTime = race.times.find((t) => t.caller === callerName);
      if (!callerTime) continue;

      totalRacesWithCaller++;
      allTimes.push(callerTime.minutes);

      if (cat === "precall") precallTimes.push(callerTime.minutes);
      else if (cat === "strong") strongTimes.push(callerTime.minutes);
      else if (cat === "tossup") tossupTimes.push(callerTime.minutes);

      // First call = this caller had the lowest time in this race
      const bestTime = Math.min(...race.times.map((t) => t.minutes));
      if (callerTime.minutes === bestTime) firstCalls++;
    }

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    results.push({
      id: meta.id,
      name: meta.name,
      shortName: meta.shortName,
      color: meta.color,
      avgAll: Math.round(avg(allTimes) * 10) / 10,
      avgPrecall: Math.round(avg(precallTimes) * 10) / 10,
      avgStrong: Math.round(avg(strongTimes) * 10) / 10,
      avgTossup: Math.round(avg(tossupTimes) * 10) / 10,
      totalCalls: totalRacesWithCaller,
      firstCalls,
      firstCallPct: totalRacesWithCaller > 0 ? Math.round((firstCalls / totalRacesWithCaller) * 100) : 0,
      incorrectCalls,
      countPrecall: precallTimes.length,
      countStrong: strongTimes.length,
      countTossup: tossupTimes.length,
    });
  }

  return results;
}
