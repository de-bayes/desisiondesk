import { headToHead } from "@/lib/charts-data";
import { scoreColor } from "@/lib/data";

const callers = ["VoteHub", "DDHQ", "AP"];

export default function HeadToHeadChart() {
  const getWinPct = (a: string, b: string) => {
    const match = headToHead.find((h) => h.caller === a && h.vs === b);
    return match ? match.winPct : 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-widest text-muted text-left">
              Caller
            </th>
            {callers.map((c) => (
              <th
                key={c}
                className="pb-3 px-6 text-xs font-semibold uppercase tracking-widest text-muted text-center"
              >
                vs {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {callers.map((row) => (
            <tr key={row} className="border-t border-border">
              <td className="py-4 pr-6 font-medium text-foreground">
                {row}
              </td>
              {callers.map((col) => {
                if (row === col) {
                  return (
                    <td
                      key={col}
                      className="py-4 px-6 text-center text-muted"
                      style={{ backgroundColor: "#1c1a17" }}
                    >
                      —
                    </td>
                  );
                }
                const pct = getWinPct(row, col);
                return (
                  <td
                    key={col}
                    className="py-4 px-6 text-center font-mono tabular-nums font-medium"
                    style={{ backgroundColor: scoreColor(pct) }}
                  >
                    {pct}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
