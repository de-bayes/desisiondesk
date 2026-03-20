import { margins } from "@/lib/charts-data";
import { callerColors } from "@/lib/data";

const colors: Record<string, string> = {
  VoteHub: callerColors.votehub,
  DDHQ: callerColors.ddhq,
  AP: callerColors.ap,
};

export default function MarginOfVictory() {
  const maxMargin = Math.max(...margins.map((m) => m.avgMarginWhenFirst));
  const ceil = Math.ceil(maxMargin / 5) * 5;

  const barH = 36;
  const gap = 14;
  const labelW = 130;
  const chartW = 400;
  const valW = 60;
  const svgW = labelW + chartW + valW;
  const svgH = margins.length * (barH + gap) - gap;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-xl"
        style={{ minWidth: 360 }}
      >
        {margins.map((m, i) => {
          const y = i * (barH + gap);
          const avgW = (m.avgMarginWhenFirst / ceil) * chartW;
          const medW = (m.medianMarginWhenFirst / ceil) * chartW;
          const color = colors[m.caller] || "#94a3b8";

          return (
            <g key={m.caller}>
              <text
                x={labelW - 10}
                y={y + barH / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={13}
                fill="#f0ebe3"
                fontWeight={500}
              >
                {m.caller}
              </text>

              {/* bg */}
              <rect x={labelW} y={y} width={chartW} height={barH} rx={4} fill="#1c1a17" />

              {/* avg bar */}
              <rect x={labelW} y={y} width={avgW} height={barH} rx={4} fill={color} opacity={0.7} />

              {/* median marker */}
              <line
                x1={labelW + medW}
                x2={labelW + medW}
                y1={y + 2}
                y2={y + barH - 2}
                stroke={color}
                strokeWidth={2.5}
                opacity={1}
              />

              {/* value */}
              <text
                x={labelW + chartW + 8}
                y={y + barH / 2}
                dominantBaseline="central"
                fontSize={12}
                fill="#8a8275"
                fontFamily="monospace"
              >
                {m.avgMarginWhenFirst}m
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-6 mt-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 rounded bg-gray-300 opacity-70" />
          <span>Avg margin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3 bg-gray-500" />
          <span>Median</span>
        </div>
      </div>
    </div>
  );
}
