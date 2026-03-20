"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importCsv } from "@/lib/actions";

export default function ImportPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await importCsv(formData);

    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      setStatus(
        `Imported ${result.raceCount} races. Redirecting...`
      );
      setTimeout(() => router.push(`/admin/night/${result.nightId}`), 1000);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Import Races from CSV</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Election Night Name
            </label>
            <input
              name="nightName"
              type="text"
              required
              placeholder="e.g. March 2026 Specials"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input
              name="nightDate"
              type="date"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              CSV File
            </label>
            <input
              name="file"
              type="file"
              accept=".csv"
              required
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Columns: name, state, category, raceType, pollCloseTime
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {status && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Importing..." : "Import"}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Example CSV</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
{`name,state,category,raceType,pollCloseTime
TX-28 Special,TX,Competitive,Special,2026-03-15T02:00:00Z
OH-15 Special,OH,Lean,Special,2026-03-15T00:30:00Z
CA-22 Special,CA,Instant,Special,2026-03-15T04:00:00Z`}
        </pre>
      </div>
    </div>
  );
}
