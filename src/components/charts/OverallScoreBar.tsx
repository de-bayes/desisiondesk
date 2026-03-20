import { grades, computeScore, letterGrade, scoreColor } from "@/lib/data";

export default function OverallScoreBar() {
  const ranked = grades
    .map((g) => ({ ...g, score: computeScore(g), grade: letterGrade(computeScore(g)) }))
    .sort((a, b) => b.score - a.score);

  const barH = 32;
  const gap = 12;
  const labelW = 140;
  const scoreW = 50;
  const chartW = 360;
  const svgW = labelW + chartW + scoreW;
  const svgH = ranked.length * (barH + gap) - gap + 8;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-lg"
        style={{ minWidth: 340 }}
      >
        {ranked.map((caller, i) => {
          const y = i * (barH + gap);
          const w = (caller.score / 100) * chartW;
          return (
            <g key={caller.id}>
              {/* Label */}
              <text
                x={labelW - 12}
                y={y + barH / 2}
                textAnchor="end"
                dominantBaseline="central"
                className="text-sm font-medium"
                fill="#f0ebe3"
                fontSize={13}
              >
                {caller.name}
              </text>
              {/* Bar bg */}
              <rect
                x={labelW}
                y={y}
                width={chartW}
                height={barH}
                rx={4}
                fill="#1c1a17"
              />
              {/* Bar fill */}
              <rect
                x={labelW}
                y={y}
                width={w}
                height={barH}
                rx={4}
                fill={scoreColor(caller.score)}
              />
              {/* Grade letter inside bar */}
              <text
                x={labelW + 12}
                y={y + barH / 2}
                dominantBaseline="central"
                fontSize={14}
                fontWeight={700}
                fill="#f0ebe3"
              >
                {caller.grade}
              </text>
              {/* Score */}
              <text
                x={labelW + chartW + 12}
                y={y + barH / 2}
                dominantBaseline="central"
                fontSize={14}
                fontFamily="monospace"
                fill="#8a8275"
              >
                {caller.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
