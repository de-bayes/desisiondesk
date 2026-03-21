import {
  grades as staticGrades,
  recentCalls,
  fmt,
  scoreColor,
  gradeColor,
  timeToScore,
  computeScore,
  letterGrade,
  categoryScores,
} from "@/lib/data";
import { fetchSheetRaces, computeGradesFromSheet } from "@/lib/sheets";
import Nav from "@/components/Nav";
import OverallScoreBar from "@/components/charts/OverallScoreBar";
import CategoryBreakdown from "@/components/charts/CategoryBreakdown";
import FirstCallShare from "@/components/charts/FirstCallShare";
import RaceTimeline from "@/components/charts/RaceTimeline";
import SpeedOverTime from "@/components/charts/SpeedOverTime";
import HeadToHeadChart from "@/components/charts/HeadToHead";
import MarginOfVictory from "@/components/charts/MarginOfVictory";
import Distribution from "@/components/charts/Distribution";
import RadarByType from "@/components/charts/RadarByType";
import CumulativeFirstCalls from "@/components/charts/CumulativeFirstCalls";

export default async function Grades() {
  const sheetRaces = await fetchSheetRaces();
  const sheetGrades = computeGradesFromSheet(sheetRaces);
  const grades = sheetGrades && sheetGrades.some((g) => g.totalCalls > 0) ? sheetGrades : staticGrades;
  return (
    <div className="min-h-screen flex flex-col">
      <Nav active="/grades" />

      <main className="flex-1 px-8 max-w-5xl mx-auto w-full">
        <section className="pt-12 pb-10">
          <h1
            className="text-3xl sm:text-4xl font-medium text-foreground mb-3"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Grades
          </h1>
          <p className="text-sm text-muted max-w-lg leading-relaxed">
            Grading the speed of election race calls across VoteHub,
            Decision Desk HQ, and the Associated Press. Updated nightly.
          </p>
        </section>

        <hr className="border-border" />

        {/* Overview */}
        <section className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2
                className="text-xl font-medium text-foreground mb-3"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Overview
              </h2>
              <p className="text-sm text-muted mb-8 max-w-sm leading-relaxed">
                Composite scores based on weighted call times across four
                competitiveness categories, plus a first-call bonus.
              </p>
              <OverallScoreBar />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">
                Breakdown by Category
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="pb-3 pr-3 text-[11px] font-semibold uppercase tracking-widest text-muted">Desk</th>
                      <th className="pb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted text-center">Grade</th>
                      <th className="pb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">Pre-Call</th>
                      <th className="pb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">Strong</th>
                      <th className="pb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">Toss-Up</th>
                      <th className="pb-3 pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">1st %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => {
                      const score = computeScore(g);
                      const grade = letterGrade(score);
                      const cats = categoryScores(g);
                      return (
                        <tr key={g.id} className="border-t border-border">
                          <td className="py-3 pr-3 font-medium text-foreground">{g.name}</td>
                          <td className="py-3 px-3 text-center font-bold" style={{ backgroundColor: gradeColor(grade) }}>{grade}</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums" style={{ backgroundColor: scoreColor(cats.precall) }}>{fmt(g.avgPrecall)}</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums" style={{ backgroundColor: scoreColor(cats.strong) }}>{fmt(g.avgStrong)}</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums" style={{ backgroundColor: scoreColor(cats.tossup) }}>{fmt(g.avgTossup)}</td>
                          <td className="py-3 pl-3 text-right font-mono tabular-nums" style={{ backgroundColor: scoreColor(Math.round((g.firstCallPct / Math.max(...grades.map((x) => x.firstCallPct))) * 100)) }}>{g.firstCallPct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Speed Analysis */}
        <section className="py-12">
          <h2
            className="text-xl font-medium text-foreground mb-2"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Speed Analysis
          </h2>
          <p className="text-sm text-muted mb-10 max-w-lg leading-relaxed">
            How fast each desk calls races, and how that&apos;s changing over time.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Average Call Time by Category</h3>
              <CategoryBreakdown />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Speed Over Time</h3>
              <SpeedOverTime />
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Competition */}
        <section className="py-12">
          <h2
            className="text-xl font-medium text-foreground mb-2"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Competition
          </h2>
          <p className="text-sm text-muted mb-10 max-w-lg leading-relaxed">
            How desks stack up against each other, and who pulls ahead when they call it first.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Head-to-Head Win Rate</h3>
              <HeadToHeadChart />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Margin of Victory</h3>
              <MarginOfVictory />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mt-14">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">First to Call</h3>
              <FirstCallShare />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Cumulative First Calls</h3>
              <CumulativeFirstCalls />
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Consistency */}
        <section className="py-12">
          <h2
            className="text-xl font-medium text-foreground mb-2"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Consistency
          </h2>
          <p className="text-sm text-muted mb-10 max-w-lg leading-relaxed">
            Distribution of call times and performance across different race types.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Call Time Distribution</h3>
              <Distribution />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Performance by Race Type</h3>
              <RadarByType />
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Race Log */}
        <section className="py-12">
          <h2
            className="text-xl font-medium text-foreground mb-2"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Race Log
          </h2>
          <p className="text-sm text-muted mb-10 max-w-lg leading-relaxed">
            Individual race results with call times per desk.
          </p>
          <div className="mb-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Timeline</h3>
            <RaceTimeline />
          </div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-6">Detailed Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr>
                  <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-widest text-muted">Race</th>
                  <th className="pb-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-muted">Category</th>
                  <th className="pb-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">VoteHub</th>
                  <th className="pb-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">DDHQ</th>
                  <th className="pb-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">AP</th>
                  <th className="pb-3 pl-4 text-[11px] font-semibold uppercase tracking-widest text-muted text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((r, ri) => {
                  const times = r.times.map((t) => t.minutes);
                  const best = Math.min(...times);
                  const worst = Math.max(...times);
                  const getTime = (name: string) => r.times.find((t) => t.caller === name);
                  return (
                    <tr key={ri} className="border-t border-border">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-foreground">{r.race}</span>
                        <span className="text-muted ml-2">{r.state}</span>
                      </td>
                      <td className="py-3 px-4 text-muted text-[11px] uppercase tracking-wider">{r.category}</td>
                      {["VoteHub", "DDHQ", "AP"].map((name) => {
                        const t = getTime(name);
                        const score = t ? timeToScore(t.minutes, best, worst) : 50;
                        return (
                          <td key={name} className="py-3 px-4 text-right font-mono tabular-nums" style={{ backgroundColor: t ? scoreColor(score) : undefined }}>
                            {t ? fmt(t.minutes) : "\u2014"}
                          </td>
                        );
                      })}
                      <td className="py-3 pl-4 text-right text-muted">{r.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="px-8 py-8 max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="text-xs text-muted/50">&copy; 2026 DecisionDesk</span>
        <span className="text-xs text-muted/50">Data updates nightly</span>
      </footer>
    </div>
  );
}
