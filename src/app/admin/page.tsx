import Link from "next/link";
import { getElectionNights, getAllCallers } from "@/lib/queries";

export default async function AdminDashboard() {
  const nights = await getElectionNights();
  const callers = await getAllCallers();
  const totalCallers = callers.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Election Nights</h1>
        <Link
          href="/admin/import"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Import CSV
        </Link>
      </div>

      {nights.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No election nights yet</p>
          <p className="text-sm">
            <Link href="/admin/import" className="text-blue-600 underline">
              Import a CSV
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {nights.map((night) => {
            const totalRaces = night.races.length;
            const totalCalls = night.races.reduce(
              (sum, r) => sum + r.calls.length,
              0
            );
            const maxCalls = totalRaces * totalCallers;
            const pct = maxCalls > 0 ? Math.round((totalCalls / maxCalls) * 100) : 0;

            return (
              <Link
                key={night.id}
                href={`/admin/night/${night.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{night.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(night.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {totalRaces} race{totalRaces !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {totalCalls}/{maxCalls} calls ({pct}%)
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
