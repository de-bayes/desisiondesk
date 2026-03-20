import { recentCalls, grades, fmt } from "@/lib/data";

export default function RaceTimeline() {
  // Find max time for scale
  const maxTime = Math.max(
    ...recentCalls.flatMap((r) => r.times.map((t) => t.minutes))
  );
  const scale = Math.ceil(maxTime / 30) * 30; // round up to nearest 30

  const rowH = 36;
  const labelW = 120;
  const chartW = 480;
  const rightPad = 40;
  const topPad = 24;
  const svgW = labelW + chartW + rightPad;
  const svgH = topPad + recentCalls.length * rowH + 8;

  const callerColors: Record<string, string> = {};
  grades.forEach((g) => {
    callerColors[g.name] = g.color;
    callerColors[g.shortName] = g.color;
  });

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-3xl"
        style={{ minWidth: 500 }}
      >
        {/* Time axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const x = labelW + t * chartW;
          const mins = Math.round(t * scale);
          return (
            <g key={t}>
              <line
                x1={x}
                y1={topPad - 4}
                x2={x}
                y2={svgH}
                stroke="#282420"
                strokeWidth={1}
                strokeDasharray={t === 0 ? undefined : "2,4"}
              />
              <text
                x={x}
                y={topPad - 10}
                textAnchor="middle"
                fontSize={9}
                fill="#8a8275"
                fontFamily="monospace"
              >
                {mins}m
              </text>
            </g>
          );
        })}

        {recentCalls.map((race, ri) => {
          const y = topPad + ri * rowH + rowH / 2;

          return (
            <g key={ri}>
              {/* Race label */}
              <text
                x={labelW - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={11}
                fill="#f0ebe3"
                fontWeight={500}
              >
                {race.race}
              </text>

              {/* Row line */}
              <line
                x1={labelW}
                x2={labelW + chartW}
                y1={y}
                y2={y}
                stroke="#1c1a17"
                strokeWidth={1}
              />

              {/* Dots for each caller */}
              {race.times
                .sort((a, b) => a.minutes - b.minutes)
                .map((t, ti) => {
                  const x = labelW + (t.minutes / scale) * chartW;
                  const color = callerColors[t.caller] || "#94a3b8";
                  return (
                    <g key={t.caller}>
                      <circle cx={x} cy={y} r={5} fill={color} />
                      {/* Caller initial label */}
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        fontSize={8}
                        fill="#8a8275"
                        fontFamily="monospace"
                      >
                        {t.caller === "VoteHub"
                          ? "VH"
                          : t.caller === "Decision Desk HQ"
                            ? "DD"
                            : t.caller}
                      </text>
                    </g>
                  );
                })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        {grades.map((g) => (
          <div key={g.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: g.color }}
            />
            <span className="text-xs text-muted">{g.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
