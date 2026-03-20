import { monthlyAvgs } from "@/lib/charts-data";
import { callerColors } from "@/lib/data";

export default function SpeedOverTime() {
  const maxTime = Math.max(
    ...monthlyAvgs.flatMap((m) => [m.votehub, m.ddhq, m.ap])
  );
  const ceil = Math.ceil(maxTime / 10) * 10;

  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const chartW = 520;
  const chartH = 200;
  const svgW = padL + chartW + padR;
  const svgH = padT + chartH + padB;

  const xStep = chartW / (monthlyAvgs.length - 1);

  const line = (key: "votehub" | "ddhq" | "ap") =>
    monthlyAvgs
      .map((m, i) => {
        const x = padL + i * xStep;
        const y = padT + chartH - (m[key] / ceil) * chartH;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  const lines: { key: "votehub" | "ddhq" | "ap"; color: string; name: string }[] = [
    { key: "votehub", color: callerColors.votehub, name: "VoteHub" },
    { key: "ddhq", color: callerColors.ddhq, name: "DDHQ" },
    { key: "ap", color: callerColors.ap, name: "AP" },
  ];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl"
        style={{ minWidth: 400 }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + chartH - t * chartH;
          return (
            <g key={t}>
              <line x1={padL} x2={padL + chartW} y1={y} y2={y} stroke="#282420" strokeWidth={1} />
              <text x={padL - 6} y={y} textAnchor="end" dominantBaseline="central" fontSize={9} fill="#8a8275" fontFamily="monospace">
                {Math.round(t * ceil)}m
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {monthlyAvgs.map((m, i) => (
          <text
            key={i}
            x={padL + i * xStep}
            y={padT + chartH + 18}
            textAnchor="middle"
            fontSize={10}
            fill="#8a8275"
          >
            {m.month}
          </text>
        ))}

        {/* Lines */}
        {lines.map(({ key, color }) => (
          <path
            key={key}
            d={line(key)}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        ))}

        {/* Dots */}
        {lines.map(({ key, color }) =>
          monthlyAvgs.map((m, i) => (
            <circle
              key={`${key}-${i}`}
              cx={padL + i * xStep}
              cy={padT + chartH - (m[key] / ceil) * chartH}
              r={3.5}
              fill={color}
            />
          ))
        )}
      </svg>

      <div className="flex items-center gap-6 mt-3">
        {lines.map((c) => (
          <div key={c.key} className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded" style={{ backgroundColor: c.color }} />
            <span className="text-xs text-muted">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
