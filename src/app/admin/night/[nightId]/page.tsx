import { getElectionNight, getAllCallers } from "@/lib/queries";
import { notFound } from "next/navigation";
import CallEntryForm from "./CallEntryForm";

export default async function NightPage({
  params,
}: {
  params: Promise<{ nightId: string }>;
}) {
  const { nightId } = await params;
  const [night, callers] = await Promise.all([
    getElectionNight(nightId),
    getAllCallers(),
  ]);

  if (!night) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{night.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(night.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {night.races.length} race{night.races.length !== 1 ? "s" : ""}
        </p>
      </div>

      {night.races.length === 0 ? (
        <p className="text-gray-500">No races in this election night.</p>
      ) : (
        <div className="space-y-4">
          {night.races.map((race) => (
            <div
              key={race.id}
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-semibold">{race.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {race.state} · {race.category} · {race.raceType} · Polls
                    close{" "}
                    {new Date(race.pollCloseTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {race.calls.length}/{callers.length} called
                </span>
              </div>

              <div className="space-y-3">
                {callers.map((caller) => {
                  const existingCall = race.calls.find(
                    (c) => c.callerId === caller.id
                  );
                  return (
                    <CallEntryForm
                      key={caller.id}
                      raceId={race.id}
                      caller={caller}
                      existingCall={existingCall || null}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
