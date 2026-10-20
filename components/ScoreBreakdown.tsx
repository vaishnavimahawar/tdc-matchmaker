import type { MatchResult } from "@/lib/matching/types";

/** Why: showing each dimension lets a matchmaker defend the number on a family call. */
export function ScoreBreakdown({ result }: { result: MatchResult }) {
  return (
    <ul className="space-y-3">
      {result.dimensions.map((dimension) => (
        <li key={dimension.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-stone-800">{dimension.label}</span>
            <span className="text-sm text-rose-800">{dimension.score}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-rose-50">
            <div
              className="h-full rounded-full bg-rose-400"
              style={{ width: `${dimension.score}%` }}
            />
          </div>
          <p className="mt-1 text-xs leading-5 text-stone-500">{dimension.reason}</p>
        </li>
      ))}
    </ul>
  );
}
