import Nav from "@/components/Nav";
import { recentCalls, fmt, scoreColor, timeToScore } from "@/lib/data";
import { fetchSheetRaces } from "@/lib/sheets";

export default async function RacesPage() {
  const sheetRaces = await fetchSheetRaces();
  const hasSheetData = sheetRaces.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav active="/races" />

      <main className="flex-1 px-8 max-w-5xl mx-auto w-full">
        <section className="pt-12 pb-10">
          <h1
            className="text-3xl sm:text-4xl font-medium text-foreground mb-3"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Races
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            {hasSheetData ? sheetRaces.length : recentCalls.length} race calls tracked across all desks.
          </p>
        </section>

        <hr className="border-border mb-8" />

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
              {hasSheetData
                ? sheetRaces.map((r, ri) => {
                    const times = r.times.map((t) => t.minutes);
                    const best = times.length > 0 ? Math.min(...times) : 0;
                    const worst = times.length > 0 ? Math.max(...times) : 0;
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
                              {t ? (
                                t.link ? (
                                  <a href={t.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {fmt(t.minutes)}
                                  </a>
                                ) : fmt(t.minutes)
                              ) : "\u2014"}
                            </td>
                          );
                        })}
                        <td className="py-3 pl-4 text-right text-muted">{r.date}</td>
                      </tr>
                    );
                  })
                : recentCalls.map((r, ri) => {
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
      </main>

      <footer className="px-8 py-8 max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="text-xs text-muted/50">&copy; 2026 DecisionDesk</span>
        <span className="text-xs text-muted/50">Data updates nightly</span>
      </footer>
    </div>
  );
}
