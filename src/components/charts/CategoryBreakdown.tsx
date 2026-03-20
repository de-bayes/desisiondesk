import { grades, fmt } from "@/lib/data";

const categories = [
  { key: "avgPrecall" as const, label: "Pre-Call" },
  { key: "avgStrong" as const, label: "Strong/Lean" },
  { key: "avgTossup" as const, label: "Toss-Up" },
];

export default function CategoryBreakdown() {
  // Find max time across all categories for scale
  const maxTime = Math.max(
    ...grades.flatMap((g) =>
      categories.map((c) => g[c.key])
    )
  );

  const groupW = 140;
  const barW = 32;
  const barGap = 6;
  const chartH = 200;
  const labelH = 40;
  const topPad = 24;
  const svgW = categories.length * groupW + 40;
  const svgH = chartH + labelH + topPad;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-3xl"
        style={{ minWidth: 500 }}
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = topPad + chartH - t * chartH;
          return (
            <g key={t}>
              <line
                x1={20}
                x2={svgW - 20}
                y1={y}
                y2={y}
                stroke="#282420"
                strokeWidth={1}
              />
              <text
                x={14}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={9}
                fill="#8a8275"
                fontFamily="monospace"
              >
                {fmt(t * maxTime)}
              </text>
            </g>
          );
        })}

        {categories.map((cat, ci) => {
          const groupX = 40 + ci * groupW;
          const groupCenter = groupX + groupW / 2;

          return (
            <g key={cat.key}>
              {/* Category label */}
              <text
                x={groupCenter}
                y={topPad + chartH + 20}
                textAnchor="middle"
                fontSize={11}
                fill="#8a8275"
                fontWeight={500}
              >
                {cat.label}
              </text>

              {/* Bars */}
              {grades.map((g, gi) => {
                const val = g[cat.key];
                const h = (val / maxTime) * chartH;
                const x =
                  groupCenter -
                  ((grades.length * (barW + barGap) - barGap) / 2) +
                  gi * (barW + barGap);
                const y = topPad + chartH - h;

                return (
                  <g key={g.id}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      rx={3}
                      fill={g.color}
                    />
                    {/* Time label on top */}
                    <text
                      x={x + barW / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#8a8275"
                      fontFamily="monospace"
                    >
                      {fmt(val)}
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
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: g.color }}
            />
            <span className="text-xs text-muted">{g.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
