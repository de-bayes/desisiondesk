import {
  grades as staticGrades,
  fmt,
  computeScore,
  letterGrade,
  categoryScores,
} from "@/lib/data";
import { fetchSheetRaces, computeGradesFromSheet } from "@/lib/sheets";
import Nav from "@/components/Nav";
import HeadToHeadChart from "@/components/charts/HeadToHead";

export default async function Grades() {
  const sheetRaces = await fetchSheetRaces();
  const sheetGrades = computeGradesFromSheet(sheetRaces);
  const grades = sheetGrades && sheetGrades.some((g) => g.totalCalls > 0) ? sheetGrades : staticGrades;

  const ranked = grades
    .map((g) => ({
      ...g,
      score: computeScore(g),
      grade: letterGrade(computeScore(g)),
      cats: categoryScores(g),
    }))
    .sort((a, b) => b.score - a.score);

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
            Decision Desk HQ, and the Associated Press.
          </p>
        </section>

        <hr className="border-border" />

        {/* Grade Cards */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ranked.map((g) => (
              <div key={g.id} className="text-center py-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">
                  {g.name}
                </p>
                <div
                  className="text-[7rem] leading-none font-black"
                  style={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    color: g.grade === "A" ? "#f0ebe3" : g.grade === "B" ? "#8a8275" : "#504a42",
                  }}
                >
                  {g.grade}
                </div>
                <p className="mt-3 text-2xl font-mono tabular-nums text-foreground">
                  {g.score}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border" />

        {/* Key Stats */}
        <section className="py-12">
          <h2
            className="text-xl font-medium text-foreground mb-10"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Key Stats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Avg Call Time */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">
                Avg Call Time
              </p>
              <div className="space-y-3">
                {ranked.map((g) => (
                  <div key={g.id} className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">{g.shortName}</span>
                    <span className="text-lg font-mono tabular-nums text-foreground">{fmt(g.avgAll)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* First Call % */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">
                First to Call
              </p>
              <div className="space-y-3">
                {ranked.map((g) => (
                  <div key={g.id} className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">{g.shortName}</span>
                    <span className="text-lg font-mono tabular-nums text-foreground">{g.firstCallPct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toss-Up Speed */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">
                Toss-Up Avg
              </p>
              <div className="space-y-3">
                {ranked.map((g) => (
                  <div key={g.id} className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">{g.shortName}</span>
                    <span className="text-lg font-mono tabular-nums text-foreground">{fmt(g.avgTossup)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Races Tracked */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">
                Races Tracked
              </p>
              <div className="space-y-3">
                {ranked.map((g) => (
                  <div key={g.id} className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">{g.shortName}</span>
                    <span className="text-lg font-mono tabular-nums text-foreground">{g.totalCalls}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Head to Head */}
        <section className="py-12">
          <h2
            className="text-xl font-medium text-foreground mb-10"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Head to Head
          </h2>
          <HeadToHeadChart />
        </section>
      </main>

      <footer className="px-8 py-8 max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="text-xs text-muted/50">&copy; 2026 DecisionDesk</span>
        <span className="text-xs text-muted/50">Data updates nightly</span>
      </footer>
    </div>
  );
}
