import { distributions } from "@/lib/charts-data";
import { callerColors } from "@/lib/data";

const colors: Record<string, string> = {
  VoteHub: callerColors.votehub,
  DDHQ: callerColors.ddhq,
  AP: callerColors.ap,
};

export default function Distribution() {
  const maxVal = Math.max(...distributions.map((d) => d.max));
  const ceil = Math.ceil(maxVal / 30) * 30;

  const rowH = 48;
  const gap = 20;
  const labelW = 130;
  const chartW = 420;
  const padT = 24;
  const svgW = labelW + chartW + 40;
  const svgH = padT + distributions.length * (rowH + gap) - gap;

  const toX = (v: number) => labelW + (v / ceil) * chartW;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl"
        style={{ minWidth: 400 }}
      >
        {/* Time axis */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const x = labelW + t * chartW;
          return (
            <g key={t}>
              <line x1={x} x2={x} y1={padT - 4} y2={svgH} stroke="#282420" strokeWidth={1} strokeDasharray="2,4" />
              <text x={x} y={padT - 10} textAnchor="middle" fontSize={9} fill="#8a8275" fontFamily="monospace">
                {Math.round(t * ceil)}m
              </text>
            </g>
          );
        })}

        {distributions.map((d, i) => {
          const y = padT + i * (rowH + gap) + rowH / 2;
          const color = colors[d.caller] || "#94a3b8";

          return (
            <g key={d.caller}>
              {/* Label */}
              <text x={labelW - 10} y={y} textAnchor="end" dominantBaseline="central" fontSize={13} fill="#f0ebe3" fontWeight={500}>
                {d.caller}
              </text>

              {/* Whisker line (min to max) */}
              <line x1={toX(d.min)} x2={toX(d.max)} y1={y} y2={y} stroke={color} strokeWidth={1} opacity={0.4} />

              {/* Min whisker */}
              <line x1={toX(d.min)} x2={toX(d.min)} y1={y - 8} y2={y + 8} stroke={color} strokeWidth={1.5} opacity={0.5} />

              {/* Max whisker */}
              <line x1={toX(d.max)} x2={toX(d.max)} y1={y - 8} y2={y + 8} stroke={color} strokeWidth={1.5} opacity={0.5} />

              {/* IQR box (p25 to p75) */}
              <rect
                x={toX(d.p25)}
                y={y - 14}
                width={toX(d.p75) - toX(d.p25)}
                height={28}
                rx={4}
                fill={color}
                opacity={0.2}
                stroke={color}
                strokeWidth={1.5}
              />

              {/* Median line */}
              <line
                x1={toX(d.median)}
                x2={toX(d.median)}
                y1={y - 14}
                y2={y + 14}
                stroke={color}
                strokeWidth={2.5}
              />

              {/* Median label */}
              <text x={toX(d.median)} y={y - 20} textAnchor="middle" fontSize={9} fill="#8a8275" fontFamily="monospace">
                {d.median}m
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-6 mt-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 border border-gray-400 rounded bg-gray-100" />
          <span>IQR (25th–75th)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-gray-500" />
          <span>Median</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-gray-400" />
          <span>Min–Max</span>
        </div>
      </div>
    </div>
  );
}
