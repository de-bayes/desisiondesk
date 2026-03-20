// =============================
// 1. Speed Over Time (monthly)
// =============================
export interface MonthlyAvg {
  month: string;
  votehub: number;
  ddhq: number;
  ap: number;
}

export const monthlyAvgs: MonthlyAvg[] = [
  { month: "Oct '25", votehub: 15.2, ddhq: 22.1, ap: 38.4 },
  { month: "Nov '25", votehub: 13.8, ddhq: 20.5, ap: 35.1 },
  { month: "Dec '25", votehub: 14.1, ddhq: 19.8, ap: 33.7 },
  { month: "Jan '26", votehub: 12.9, ddhq: 19.2, ap: 32.4 },
  { month: "Feb '26", votehub: 11.6, ddhq: 18.4, ap: 31.8 },
  { month: "Mar '26", votehub: 12.4, ddhq: 18.7, ap: 31.2 },
];

// =============================
// 2. Head-to-Head Win Rate
// =============================
export interface HeadToHead {
  caller: string;
  vs: string;
  winPct: number;
  wins: number;
  total: number;
}

export const headToHead: HeadToHead[] = [
  { caller: "VoteHub", vs: "DDHQ", winPct: 64, wins: 312, total: 487 },
  { caller: "VoteHub", vs: "AP", winPct: 78, wins: 380, total: 487 },
  { caller: "DDHQ", vs: "VoteHub", winPct: 36, wins: 175, total: 487 },
  { caller: "DDHQ", vs: "AP", winPct: 71, wins: 346, total: 487 },
  { caller: "AP", vs: "VoteHub", winPct: 22, wins: 107, total: 487 },
  { caller: "AP", vs: "DDHQ", winPct: 29, wins: 141, total: 487 },
];

// =============================
// 3. Margin of Victory
// =============================
export interface MarginData {
  caller: string;
  avgMarginWhenFirst: number;
  medianMarginWhenFirst: number;
}

export const margins: MarginData[] = [
  { caller: "VoteHub", avgMarginWhenFirst: 8.3, medianMarginWhenFirst: 6.1 },
  { caller: "DDHQ", avgMarginWhenFirst: 5.7, medianMarginWhenFirst: 4.2 },
  { caller: "AP", avgMarginWhenFirst: 11.4, medianMarginWhenFirst: 8.9 },
];

// =============================
// 4. Call Time Distribution
// =============================
export interface DistributionData {
  caller: string;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
}

export const distributions: DistributionData[] = [
  { caller: "VoteHub", min: 0, p25: 1, median: 8, p75: 22, max: 94 },
  { caller: "DDHQ", min: 0, p25: 2, median: 12, p75: 31, max: 118 },
  { caller: "AP", min: 0, p25: 3, median: 21, p75: 52, max: 192 },
];

// =============================
// 5. Radar by Race Type
// =============================
export type RaceType = "state" | "congressional" | "senate" | "primaries";

export interface RadarScores {
  instant: number;
  lean: number;
  competitive: number;
  tossup: number;
}

export interface RadarByType {
  raceType: RaceType;
  label: string;
  callers: {
    id: string;
    name: string;
    scores: RadarScores;
  }[];
}

export const radarData: RadarByType[] = [
  {
    raceType: "state",
    label: "State Races",
    callers: [
      { id: "votehub", name: "VoteHub", scores: { instant: 95, lean: 88, competitive: 82, tossup: 70 } },
      { id: "ddhq", name: "DDHQ", scores: { instant: 90, lean: 75, competitive: 68, tossup: 58 } },
      { id: "ap", name: "AP", scores: { instant: 80, lean: 55, competitive: 45, tossup: 35 } },
    ],
  },
  {
    raceType: "congressional",
    label: "Congressional",
    callers: [
      { id: "votehub", name: "VoteHub", scores: { instant: 97, lean: 90, competitive: 78, tossup: 65 } },
      { id: "ddhq", name: "DDHQ", scores: { instant: 92, lean: 80, competitive: 72, tossup: 55 } },
      { id: "ap", name: "AP", scores: { instant: 82, lean: 60, competitive: 50, tossup: 40 } },
    ],
  },
  {
    raceType: "senate",
    label: "Senate",
    callers: [
      { id: "votehub", name: "VoteHub", scores: { instant: 93, lean: 85, competitive: 76, tossup: 72 } },
      { id: "ddhq", name: "DDHQ", scores: { instant: 88, lean: 78, competitive: 65, tossup: 60 } },
      { id: "ap", name: "AP", scores: { instant: 85, lean: 65, competitive: 55, tossup: 48 } },
    ],
  },
  {
    raceType: "primaries",
    label: "Primaries",
    callers: [
      { id: "votehub", name: "VoteHub", scores: { instant: 92, lean: 84, competitive: 80, tossup: 68 } },
      { id: "ddhq", name: "DDHQ", scores: { instant: 94, lean: 82, competitive: 70, tossup: 52 } },
      { id: "ap", name: "AP", scores: { instant: 78, lean: 58, competitive: 42, tossup: 30 } },
    ],
  },
];

// =============================
// 7. Cumulative First Calls Over Time
// =============================
export interface CumulativePoint {
  month: string;
  votehub: number;
  ddhq: number;
  ap: number;
}

export const cumulativeFirstCalls: CumulativePoint[] = [
  { month: "Oct '25", votehub: 28, ddhq: 22, ap: 18 },
  { month: "Nov '25", votehub: 68, ddhq: 49, ap: 38 },
  { month: "Dec '25", votehub: 102, ddhq: 76, ap: 58 },
  { month: "Jan '26", votehub: 138, ddhq: 105, ap: 82 },
  { month: "Feb '26", votehub: 172, ddhq: 132, ap: 105 },
  { month: "Mar '26", votehub: 203, ddhq: 156, ap: 128 },
];
