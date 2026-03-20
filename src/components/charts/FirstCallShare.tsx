import { grades } from "@/lib/data";

export default function FirstCallShare() {
  const total = grades.reduce((sum, g) => sum + g.firstCalls, 0);
  let offset = 0;
  const barH = 40;

  return (
    <div>
      <svg
        viewBox={`0 0 600 ${barH}`}
        className="w-full max-w-2xl"
        style={{ minWidth: 300 }}
        preserveAspectRatio="none"
      >
        {grades.map((g) => {
          const w = (g.firstCalls / total) * 600;
          const x = offset;
          offset += w;
          return (
            <rect
              key={g.id}
              x={x}
              y={0}
              width={w}
              height={barH}
              fill={g.color}
              rx={0}
            />
          );
        })}
        {/* Round the outer corners */}
        <rect
          x={0}
          y={0}
          width={600}
          height={barH}
          rx={6}
          fill="none"
          stroke="white"
          strokeWidth={0}
        />
      </svg>

      {/* Labels below */}
      <div className="flex mt-4 max-w-2xl">
        {grades.map((g) => {
          const pct = Math.round((g.firstCalls / total) * 100);
          return (
            <div
              key={g.id}
              className="flex flex-col"
              style={{ width: `${(g.firstCalls / total) * 100}%` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: g.color }}
                />
                <span className="text-xs font-medium text-foreground">
                  {g.shortName}
                </span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-foreground mt-1">
                {pct}%
              </span>
              <span className="text-xs text-muted">
                {g.firstCalls} calls
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
