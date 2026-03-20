export interface CallerGrade {
  id: string;
  name: string;
  shortName: string;
  color: string;
  avgAll: number;
  avgInstant: number;
  avgLean: number;
  avgCompetitive: number;
  avgTossup: number;
  totalCalls: number;
  firstCalls: number;
  firstCallPct: number;
  incorrectCalls: number;
  countInstant: number;
  countLean: number;
  countCompetitive: number;
  countTossup: number;
}

// Benchmark thresholds (minutes) — A/B/C/D/F boundaries per category
const thresholds: Record<string, number[]> = {
  instant: [0.5, 1, 2, 5],
  lean: [5, 10, 15, 25],
  competitive: [20, 30, 45, 60],
  tossup: [60, 90, 120, 180],
};

// Score a time against thresholds → 0–100
function scoreTime(minutes: number, bounds: number[]): number {
  if (minutes <= bounds[0]) return 100;
  if (minutes >= bounds[3]) return 0;
  for (let i = 0; i < 3; i++) {
    if (minutes <= bounds[i + 1]) {
      const pct = (minutes - bounds[i]) / (bounds[i + 1] - bounds[i]);
      return Math.round(100 - (i * 25 + pct * 25));
    }
  }
  return 0;
}

// Composite score with weighted categories + first-call bonus
export function computeScore(g: CallerGrade): number {
  const instant = scoreTime(g.avgInstant, thresholds.instant);
  const lean = scoreTime(g.avgLean, thresholds.lean);
  const competitive = scoreTime(g.avgCompetitive, thresholds.competitive);
  const tossup = scoreTime(g.avgTossup, thresholds.tossup);
  const weighted =
    0.15 * instant + 0.2 * lean + 0.3 * competitive + 0.35 * tossup;
  const bonus = (g.firstCallPct / 100) * 5;
  return Math.min(100, Math.round(weighted + bonus));
}

export function letterGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function categoryScores(g: CallerGrade) {
  return {
    instant: scoreTime(g.avgInstant, thresholds.instant),
    lean: scoreTime(g.avgLean, thresholds.lean),
    competitive: scoreTime(g.avgCompetitive, thresholds.competitive),
    tossup: scoreTime(g.avgTossup, thresholds.tossup),
  };
}

export const callerColors = {
  votehub: "#f0ebe3",
  ddhq: "#8a8275",
  ap: "#504a42",
};

export const grades: CallerGrade[] = [
  {
    id: "votehub",
    name: "VoteHub",
    shortName: "VH",
    color: callerColors.votehub,
    avgAll: 12.4,
    avgInstant: 0.3,
    avgLean: 8.1,
    avgCompetitive: 24.8,
    avgTossup: 67.2,
    totalCalls: 487,
    firstCalls: 203,
    firstCallPct: 42,
    incorrectCalls: 0,
    countInstant: 180,
    countLean: 140,
    countCompetitive: 110,
    countTossup: 57,
  },
  {
    id: "ddhq",
    name: "Decision Desk HQ",
    shortName: "DDHQ",
    color: callerColors.ddhq,
    avgAll: 18.7,
    avgInstant: 0.5,
    avgLean: 11.3,
    avgCompetitive: 33.1,
    avgTossup: 84.5,
    totalCalls: 487,
    firstCalls: 156,
    firstCallPct: 32,
    incorrectCalls: 0,
    countInstant: 180,
    countLean: 140,
    countCompetitive: 110,
    countTossup: 57,
  },
  {
    id: "ap",
    name: "Associated Press",
    shortName: "AP",
    color: callerColors.ap,
    avgAll: 31.2,
    avgInstant: 1.2,
    avgLean: 19.6,
    avgCompetitive: 52.4,
    avgTossup: 126.3,
    totalCalls: 487,
    firstCalls: 128,
    firstCallPct: 26,
    incorrectCalls: 1,
    countInstant: 180,
    countLean: 140,
    countCompetitive: 110,
    countTossup: 57,
  },
];

export interface RecentCall {
  race: string;
  state: string;
  category: string;
  date: string;
  times: { caller: string; minutes: number }[];
}

export const recentCalls: RecentCall[] = [
  {
    race: "TX-28 Special",
    state: "TX",
    category: "Competitive",
    date: "Mar 15",
    times: [
      { caller: "VoteHub", minutes: 18 },
      { caller: "DDHQ", minutes: 24 },
      { caller: "AP", minutes: 41 },
    ],
  },
  {
    race: "OH-15 Special",
    state: "OH",
    category: "Lean",
    date: "Mar 15",
    times: [
      { caller: "VoteHub", minutes: 6 },
      { caller: "DDHQ", minutes: 9 },
      { caller: "AP", minutes: 14 },
    ],
  },
  {
    race: "CA-22 Special",
    state: "CA",
    category: "Instant",
    date: "Mar 15",
    times: [
      { caller: "DDHQ", minutes: 0 },
      { caller: "VoteHub", minutes: 0 },
      { caller: "AP", minutes: 1 },
    ],
  },
  {
    race: "PA-07 Special",
    state: "PA",
    category: "Toss-Up",
    date: "Mar 8",
    times: [
      { caller: "VoteHub", minutes: 52 },
      { caller: "AP", minutes: 78 },
      { caller: "DDHQ", minutes: 91 },
    ],
  },
  {
    race: "WI-03 Special",
    state: "WI",
    category: "Competitive",
    date: "Mar 8",
    times: [
      { caller: "VoteHub", minutes: 22 },
      { caller: "DDHQ", minutes: 31 },
      { caller: "AP", minutes: 47 },
    ],
  },
  {
    race: "MI-08 Special",
    state: "MI",
    category: "Competitive",
    date: "Mar 1",
    times: [
      { caller: "VoteHub", minutes: 26 },
      { caller: "DDHQ", minutes: 28 },
      { caller: "AP", minutes: 55 },
    ],
  },
  {
    race: "GA-06 Special",
    state: "GA",
    category: "Lean",
    date: "Mar 1",
    times: [
      { caller: "DDHQ", minutes: 5 },
      { caller: "VoteHub", minutes: 7 },
      { caller: "AP", minutes: 11 },
    ],
  },
  {
    race: "AZ-02 Special",
    state: "AZ",
    category: "Toss-Up",
    date: "Feb 22",
    times: [
      { caller: "VoteHub", minutes: 71 },
      { caller: "DDHQ", minutes: 83 },
      { caller: "AP", minutes: 140 },
    ],
  },
  {
    race: "NY-19 Special",
    state: "NY",
    category: "Instant",
    date: "Feb 22",
    times: [
      { caller: "VoteHub", minutes: 0 },
      { caller: "DDHQ", minutes: 0 },
      { caller: "AP", minutes: 0 },
    ],
  },
  {
    race: "NV-04 Special",
    state: "NV",
    category: "Competitive",
    date: "Feb 15",
    times: [
      { caller: "VoteHub", minutes: 19 },
      { caller: "DDHQ", minutes: 35 },
      { caller: "AP", minutes: 48 },
    ],
  },
  {
    race: "NC-14 Special",
    state: "NC",
    category: "Lean",
    date: "Feb 15",
    times: [
      { caller: "VoteHub", minutes: 9 },
      { caller: "DDHQ", minutes: 12 },
      { caller: "AP", minutes: 22 },
    ],
  },
  {
    race: "FL-13 Special",
    state: "FL",
    category: "Instant",
    date: "Feb 8",
    times: [
      { caller: "DDHQ", minutes: 0 },
      { caller: "VoteHub", minutes: 1 },
      { caller: "AP", minutes: 2 },
    ],
  },
];

export function fmt(minutes: number): string {
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

// Warm pastel tints on dark background
export function scoreColor(score: number): string {
  if (score >= 90) return "#1a2f24";
  if (score >= 80) return "#222f20";
  if (score >= 70) return "#2a2e1c";
  if (score >= 60) return "#302c1a";
  if (score >= 50) return "#30271a";
  if (score >= 40) return "#30221c";
  if (score >= 30) return "#301e1e";
  return "#2e1a1a";
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "#1a2f24";
    case "B": return "#302c1a";
    case "C": return "#30221c";
    case "D": return "#301e1e";
    default: return "#1c1a17";
  }
}

export function timeToScore(time: number, best: number, worst: number): number {
  if (worst === best) return 100;
  const pct = 1 - (time - best) / (worst - best);
  return Math.round(pct * 100);
}
