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
