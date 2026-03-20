import Nav from "@/components/Nav";
import Link from "next/link";
import { getRace } from "@/lib/queries";
import { fmt } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ raceId: string }>;
}) {
  const { raceId } = await params;
  const race = await getRace(raceId);

  if (!race) notFound();

  const sortedCalls = [...race.calls].sort(
    (a, b) => a.minutesAfterClose - b.minutesAfterClose
  );
  const maxMinutes =
    sortedCalls.length > 0
      ? sortedCalls[sortedCalls.length - 1].minutesAfterClose
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav active="/races" />
      <main className="flex-1 px-8 max-w-5xl mx-auto w-full">
        <div className="pt-8">
          <Link
            href="/races"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            &larr; All Races
          </Link>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-medium text-foreground mt-6 mb-1"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          {race.name}
        </h1>
        <p className="text-muted text-sm mb-8">
          {race.state} · {race.category} · {race.raceType} ·{" "}
          {race.electionNight.name} ·{" "}
          {new Date(race.electionNight.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Call Timeline</h2>
          <div className="space-y-3">
            {sortedCalls.map((call, i) => {
              const pct =
                maxMinutes > 0
                  ? (call.minutesAfterClose / maxMinutes) * 100
                  : 100;
              return (
                <div key={call.id} className="flex items-center gap-3">
                  <span className="w-20 text-sm font-medium text-foreground text-right shrink-0">
                    {call.caller.shortName}
                  </span>
                  <div className="flex-1 bg-surface rounded-full h-8 relative overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-3"
                      style={{
                        width: `${Math.max(pct, 8)}%`,
                        backgroundColor: call.caller.color,
                        opacity: 0.7,
                      }}
                    >
                      <span className="text-xs font-medium text-white drop-shadow">
                        {fmt(call.minutesAfterClose)}
                      </span>
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="text-xs text-green-400 font-medium shrink-0">
                      First
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {sortedCalls.length === 0 && (
            <p className="text-muted text-sm">No calls recorded yet.</p>
          )}
        </div>

        {sortedCalls.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Sources</h2>
            <div className="space-y-4">
              {sortedCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-start gap-4 border border-border rounded-lg p-4"
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: call.caller.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-foreground">{call.caller.name}</span>
                      <span className="text-sm text-muted">
                        {fmt(call.minutesAfterClose)} after polls closed
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Called at{" "}
                      {new Date(call.calledAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        timeZoneName: "short",
                      })}
                    </p>
                    <div className="flex gap-4 mt-2">
                      {call.tweetUrl && (
                        <a
                          href={call.tweetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground hover:underline"
                        >
                          View tweet
                        </a>
                      )}
                      {call.screenshotPath && (
                        <a
                          href={call.screenshotPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground hover:underline"
                        >
                          View screenshot
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="px-8 py-8 max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="text-xs text-muted/50">&copy; 2026 DecisionDesk</span>
        <span className="text-xs text-muted/50">Data updates nightly</span>
      </footer>
    </div>
  );
}
