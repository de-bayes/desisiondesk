"use client";

import { useState } from "react";
import { radarData, type RaceType, type RadarScores } from "@/lib/charts-data";
import { callerColors } from "@/lib/data";

const colors: Record<string, string> = {
  votehub: callerColors.votehub,
  ddhq: callerColors.ddhq,
  ap: callerColors.ap,
};

const axes = ["Instant", "Lean", "Competitive", "Toss-Up"];
const axisKeys = ["instant", "lean", "competitive", "tossup"] as const;

function polarToCart(cx: number, cy: number, r: number, angleIdx: number, total: number) {
  const angle = (Math.PI * 2 * angleIdx) / total - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export default function RadarByType() {
  const [active, setActive] = useState<RaceType>("congressional");
  const data = radarData.find((d) => d.raceType === active)!;

  const cx = 150;
  const cy = 150;
  const maxR = 120;

  const callerPolygon = (scores: RadarScores) => {
    const points = axisKeys
      .map((key, i) => {
        const val = scores[key];
        const r = (val / 100) * maxR;
        const pt = polarToCart(cx, cy, r, i, 4);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");
    return points;
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {radarData.map((rd) => (
          <button
            key={rd.raceType}
            onClick={() => setActive(rd.raceType)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors border ${
              active === rd.raceType
                ? "bg-foreground text-background border-foreground"
                : "bg-surface text-muted border-border hover:text-foreground"
            }`}
          >
            {rd.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 300 300" className="w-full max-w-sm" style={{ minWidth: 280 }}>
          {/* Grid rings */}
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const r = t * maxR;
            const pts = Array.from({ length: 4 }, (_, i) => {
              const p = polarToCart(cx, cy, r, i, 4);
              return `${p.x},${p.y}`;
            }).join(" ");
            return (
              <polygon
                key={t}
                points={pts}
                fill="none"
                stroke="#282420"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {axes.map((_, i) => {
            const pt = polarToCart(cx, cy, maxR, i, 4);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={pt.x}
                y2={pt.y}
                stroke="#282420"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis labels */}
          {axes.map((label, i) => {
            const pt = polarToCart(cx, cy, maxR + 18, i, 4);
            return (
              <text
                key={label}
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fill="#8a8275"
              >
                {label}
              </text>
            );
          })}

          {/* Caller polygons */}
          {data.callers.map((caller) => {
            const color = colors[caller.id] || "#94a3b8";
            return (
              <g key={caller.id}>
                <polygon
                  points={callerPolygon(caller.scores)}
                  fill={color}
                  fillOpacity={0.1}
                  stroke={color}
                  strokeWidth={2}
                />
                {axisKeys.map((key, i) => {
                  const val = caller.scores[key];
                  const r = (val / 100) * maxR;
                  const pt = polarToCart(cx, cy, r, i, 4);
                  return (
                    <circle
                      key={`${caller.id}-${key}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={3}
                      fill={color}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3">
        {data.callers.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[c.id] }} />
            <span className="text-xs text-muted">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
