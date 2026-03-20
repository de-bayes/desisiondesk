import Nav from "@/components/Nav";
import Link from "next/link";
import { getRaces, getAllCallers } from "@/lib/queries";
import { fmt, scoreColor, timeToScore } from "@/lib/data";
import RacesFilter from "./RacesFilter";

export default async function RacesPage() {
  const [races, callers] = await Promise.all([getRaces(), getAllCallers()]);

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
        </section>
        <hr className="border-border mb-8" />
        <p className="text-muted text-sm mb-6">
          {races.length} race{races.length !== 1 ? "s" : ""} tracked across{" "}
          {new Set(races.map((r) => r.electionNightId)).size} election night
          {new Set(races.map((r) => r.electionNightId)).size !== 1 ? "s" : ""}
        </p>

        <RacesFilter
          races={races.map((race) => {
            const callTimes = race.calls.map((c) => c.minutesAfterClose);
            const best =
              callTimes.length > 0 ? Math.min(...callTimes) : Infinity;
            const worst =
              callTimes.length > 0 ? Math.max(...callTimes) : 0;

            return {
              id: race.id,
              name: race.name,
              state: race.state,
              category: race.category,
              raceType: race.raceType,
              nightName: race.electionNight.name,
              nightDate: race.electionNight.date.toISOString(),
              calls: race.calls.map((c) => ({
                callerName: c.caller.name,
                callerShortName: c.caller.shortName,
                callerColor: c.caller.color,
                minutesAfterClose: c.minutesAfterClose,
                score: timeToScore(c.minutesAfterClose, best, worst),
                tweetUrl: c.tweetUrl,
                screenshotPath: c.screenshotPath,
              })),
            };
          })}
          callers={callers.map((c) => c.name)}
        />
      </main>
      <footer className="px-8 py-8 max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="text-xs text-muted/50">&copy; 2026 DecisionDesk</span>
        <span className="text-xs text-muted/50">Data updates nightly</span>
      </footer>
    </div>
  );
}
