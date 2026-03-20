import { cumulativeFirstCalls } from "@/lib/charts-data";
import { callerColors } from "@/lib/data";

export default function CumulativeFirstCalls() {
  const maxVal = Math.max(
    ...cumulativeFirstCalls.flatMap((m) => [m.votehub, m.ddhq, m.ap])
  );
  const ceil = Math.ceil(maxVal / 50) * 50;

  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const chartW = 520;
  const chartH = 200;
  const svgW = padL + chartW + padR;
  const svgH = padT + chartH + padB;

  const xStep = chartW / (cumulativeFirstCalls.length - 1);

  const line = (key: "votehub" | "ddhq" | "ap") =>
    cumulativeFirstCalls
      .map((m, i) => {
        const x = padL + i * xStep;
        const y = padT + chartH - (m[key] / ceil) * chartH;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  // Area fill
  const area = (key: "votehub" | "ddhq" | "ap") => {
    const pts = cumulativeFirstCalls.map((m, i) => {
      const x = padL + i * xStep;
      const y = padT + chartH - (m[key] / ceil) * chartH;
      return `${x},${y}`;
    });
    const lastX = padL + (cumulativeFirstCalls.length - 1) * xStep;
    const baseY = padT + chartH;
    return `M ${padL},${baseY} L ${pts.join(" L ")} L ${lastX},${baseY} Z`;
  };

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
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + chartH - t * chartH;
          return (
            <g key={t}>
              <line x1={padL} x2={padL + chartW} y1={y} y2={y} stroke="#282420" strokeWidth={1} />
              <text x={padL - 6} y={y} textAnchor="end" dominantBaseline="central" fontSize={9} fill="#8a8275" fontFamily="monospace">
                {Math.round(t * ceil)}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {cumulativeFirstCalls.map((m, i) => (
          <text key={i} x={padL + i * xStep} y={padT + chartH + 18} textAnchor="middle" fontSize={10} fill="#8a8275">
            {m.month}
          </text>
        ))}

        {/* Area fills */}
        {lines.map(({ key, color }) => (
          <path key={`area-${key}`} d={area(key)} fill={color} opacity={0.08} />
        ))}

        {/* Lines */}
        {lines.map(({ key, color }) => (
          <path key={key} d={line(key)} stroke={color} strokeWidth={2} fill="none" />
        ))}

        {/* End labels */}
        {lines.map(({ key, color, name }) => {
          const last = cumulativeFirstCalls[cumulativeFirstCalls.length - 1];
          const x = padL + (cumulativeFirstCalls.length - 1) * xStep;
          const y = padT + chartH - (last[key] / ceil) * chartH;
          return (
            <g key={`label-${key}`}>
              <circle cx={x} cy={y} r={3.5} fill={color} />
              <text x={x + 8} y={y} dominantBaseline="central" fontSize={10} fill="#8a8275" fontWeight={500}>
                {last[key]}
              </text>
            </g>
          );
        })}
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
