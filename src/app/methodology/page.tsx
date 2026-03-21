import Nav from "@/components/Nav";
import { grades } from "@/lib/data";

export default function Methodology() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav active="/methodology" />

      <main className="flex-1 px-8 max-w-5xl mx-auto w-full">
        <section className="pt-12 pb-10">
          <h1
            className="text-3xl sm:text-4xl font-medium text-foreground mb-3"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Methodology
          </h1>
          <p className="text-sm text-muted max-w-lg leading-relaxed">
            How we grade the speed of race calls.
          </p>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Composite Score
          </h2>
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <p>
              Each desk receives a composite score from 0 to 100.
              The score is a weighted sum of per-category speed scores
              plus a first-call bonus that itself is weighted by
              race competitiveness.
            </p>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="text-center mb-4">
                <span className="font-mono text-lg text-foreground">
                  S = <span className="text-2xl">&#931;</span>
                  <sub className="text-xs">i</sub>{" "}
                  w<sub className="text-xs">i</sub> &middot; C<sub className="text-xs">i</sub>{" "}
                  + <span className="text-2xl">&#931;</span>
                  <sub className="text-xs">i</sub>{" "}
                  b<sub className="text-xs">i</sub> &middot; F<sub className="text-xs">i</sub>
                </span>
              </div>
              <div className="text-xs text-muted text-center mb-6">
                where S is the composite score, C is the category speed score,
                F is the first-call rate, and w and b are weights
              </div>
              <hr className="border-border mb-4" />
              <div className="font-mono text-xs text-foreground space-y-1">
                <div>S = 0.15 &middot; C<sub>precall</sub> + 0.35 &middot; C<sub>strong</sub> + 0.50 &middot; C<sub>tossup</sub></div>
                <div className="pl-4">+ first-call bonus (up to 5 pts)</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Category Weights
          </h2>
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <p>
              Not all races are equally important. Calling a safe seat
              at poll close is expected — the real test is how fast a
              desk moves when the outcome is genuinely uncertain.
            </p>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="pb-2 pr-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted">Category</th>
                  <th className="pb-2 px-4 text-right text-[11px] font-semibold uppercase tracking-widest text-muted">Weight</th>
                  <th className="pb-2 pl-4 text-right text-[11px] font-semibold uppercase tracking-widest text-muted">1st Call Bonus</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  { cat: "Pre-Call", w: "15%", b: "1.0 pt", note: "Obvious races, called at poll close" },
                  { cat: "Strong/Lean", w: "35%", b: "2.0 pts", note: "70-90% on prediction markets" },
                  { cat: "Toss-Up", w: "50%", b: "5.0 pts", note: "50-70% — the hardest calls" },
                ].map((row) => (
                  <tr key={row.cat} className="border-t border-border">
                    <td className="py-3 pr-4 font-sans">
                      <div className="font-medium text-foreground">{row.cat}</div>
                      <div className="text-xs text-muted font-sans mt-0.5">{row.note}</div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-foreground">{row.w}</td>
                    <td className="py-3 pl-4 text-right tabular-nums text-foreground">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Speed Scores
          </h2>
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <p>
              Each category score runs from 0 to 100, measured against
              absolute benchmarks — not relative to other desks.
            </p>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="pb-2 pr-3 text-left text-muted font-semibold uppercase tracking-widest">Category</th>
                  <th className="pb-2 px-3 text-right text-muted font-semibold">A</th>
                  <th className="pb-2 px-3 text-right text-muted font-semibold">B</th>
                  <th className="pb-2 px-3 text-right text-muted font-semibold">C</th>
                  <th className="pb-2 pl-3 text-right text-muted font-semibold">D</th>
                </tr>
              </thead>
              <tbody className="font-mono text-foreground">
                {[
                  { cat: "Pre-Call", vals: ["0m", "<1m", "<5m", "<15m"] },
                  { cat: "Strong/Lean", vals: ["<15m", "<45m", "<1.5h", "<3h"] },
                  { cat: "Toss-Up", vals: ["<1h", "<3h", "<6h", "<24h"] },
                ].map((row) => (
                  <tr key={row.cat} className="border-t border-border">
                    <td className="py-2 pr-3 font-sans text-foreground">{row.cat}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className="py-2 px-3 text-right text-muted">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            First-Call Bonus
          </h2>
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <p>
              Being first matters. The bonus rewards desks that consistently
              call races before competitors. Being first on a safe seat is
              worth far less than being first on a toss-up.
            </p>

            <div className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground">
              F<sub>total</sub> = 1.0 &middot; rate<sub>precall</sub> + 2.0 &middot; rate<sub>strong</sub> + 5.0 &middot; rate<sub>tossup</sub>
            </div>

            <p className="text-xs">
              Maximum possible bonus: 11.5 points. In practice, bonuses
              range from 3 to 7 points.
            </p>
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Grade Scale
          </h2>
          <div className="space-y-6">
            <div className="flex gap-2">
              {[
                { g: "A", range: "90–100", color: "#1a2f24" },
                { g: "B", range: "75–89", color: "#302c1a" },
                { g: "C", range: "60–74", color: "#30221c" },
                { g: "D", range: "40–59", color: "#301e1e" },
              ].map((item) => (
                <div
                  key={item.g}
                  className="flex-1 rounded-lg px-3 py-3 text-center"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="font-bold text-base text-foreground">{item.g}</div>
                  <div className="text-xs text-muted mt-1">{item.range}</div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Based on {grades[0].totalCalls} tracked race calls across{" "}
              {grades[0].countPrecall} pre-calls, {grades[0].countStrong} strong/lean,{" "}
              and {grades[0].countTossup} toss-up races. Competitiveness classified
              by prediction market odds.
            </p>
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
