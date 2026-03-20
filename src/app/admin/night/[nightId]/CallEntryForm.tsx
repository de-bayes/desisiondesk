"use client";

import { useState } from "react";
import { saveCall } from "@/lib/actions";

interface Caller {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

interface ExistingCall {
  id: string;
  calledAt: Date;
  tweetUrl: string | null;
  screenshotPath: string | null;
}

export default function CallEntryForm({
  raceId,
  caller,
  existingCall,
}: {
  raceId: string;
  caller: Caller;
  existingCall: ExistingCall | null;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [screenshotPath, setScreenshotPath] = useState(
    existingCall?.screenshotPath || ""
  );

  function formatDatetimeLocal(d: Date) {
    const dt = new Date(d);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.path) {
      setScreenshotPath(data.path);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    formData.set("screenshotPath", screenshotPath);
    await saveCall(formData);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 text-sm"
    >
      <input type="hidden" name="raceId" value={raceId} />
      <input type="hidden" name="callerId" value={caller.id} />
      <input type="hidden" name="screenshotPath" value={screenshotPath} />

      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: caller.color }}
      />
      <span className="w-16 font-medium shrink-0">{caller.shortName}</span>

      <input
        name="calledAt"
        type="datetime-local"
        defaultValue={
          existingCall ? formatDatetimeLocal(existingCall.calledAt) : ""
        }
        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <input
        name="tweetUrl"
        type="url"
        placeholder="Tweet URL"
        defaultValue={existingCall?.tweetUrl || ""}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <label className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 shrink-0">
        {screenshotPath ? "Replace" : "Screenshot"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
      {screenshotPath && (
        <span className="text-xs text-green-600 shrink-0">Uploaded</span>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 shrink-0"
      >
        {saving ? "..." : saved ? "Saved" : "Save"}
      </button>
    </form>
  );
}
