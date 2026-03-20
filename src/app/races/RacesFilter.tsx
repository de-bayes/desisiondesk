"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { scoreColor, fmt } from "@/lib/data";

interface CallInfo {
  callerName: string;
  callerShortName: string;
  callerColor: string;
  minutesAfterClose: number;
  score: number;
  tweetUrl: string | null;
  screenshotPath: string | null;
}

interface RaceRow {
  id: string;
  name: string;
  state: string;
  category: string;
  raceType: string;
  nightName: string;
  nightDate: string;
  calls: CallInfo[];
}

export default function RacesFilter({
  races,
  callers,
}: {
  races: RaceRow[];
  callers: string[];
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const categories = useMemo(
    () => [...new Set(races.map((r) => r.category))].sort(),
    [races]
  );
  const states = useMemo(
    () => [...new Set(races.map((r) => r.state))].sort(),
    [races]
  );

  const filtered = useMemo(() => {
    return races.filter((r) => {
      if (
        search &&
        !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.state.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (categoryFilter && r.category !== categoryFilter) return false;
      if (stateFilter && r.state !== stateFilter) return false;
      return true;
    });
  }, [races, search, categoryFilter, stateFilter]);

  return (
    <div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search races..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground w-64 focus:outline-none focus:ring-2 focus:ring-muted focus:border-transparent placeholder:text-muted"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-muted focus:border-transparent"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-muted focus:border-transparent"
        >
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-medium text-foreground">Race</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">State</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">Category</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">Night</th>
              {callers.map((c) => (
                <th key={c} className="text-center py-3 px-2 font-medium text-foreground">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((race) => (
              <tr
                key={race.id}
                className="border-b border-border hover:bg-surface"
              >
                <td className="py-2.5 px-3">
                  <Link
                    href={`/races/${race.id}`}
                    className="text-foreground hover:underline font-medium"
                  >
                    {race.name}
                  </Link>
                </td>
                <td className="py-2.5 px-2 text-muted">{race.state}</td>
                <td className="py-2.5 px-2 text-muted">{race.category}</td>
                <td className="py-2.5 px-2 text-muted text-xs">
                  {race.nightName}
                </td>
                {callers.map((callerName) => {
                  const call = race.calls.find(
                    (c) => c.callerName === callerName
                  );
                  if (!call) {
                    return (
                      <td
                        key={callerName}
                        className="py-2.5 px-2 text-center text-muted/40"
                      >
                        —
                      </td>
                    );
                  }
                  return (
                    <td
                      key={callerName}
                      className="py-2.5 px-2 text-center"
                      style={{ backgroundColor: scoreColor(call.score) }}
                    >
                      <span className="font-medium text-foreground">
                        {fmt(call.minutesAfterClose)}
                      </span>
                      {(call.tweetUrl || call.screenshotPath) && (
                        <span className="ml-1 text-muted">
                          {call.tweetUrl && (
                            <a
                              href={call.tweetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-foreground"
                            >
                              [link]
                            </a>
                          )}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">
          No races match your filters.
        </p>
      )}
    </div>
  );
}
