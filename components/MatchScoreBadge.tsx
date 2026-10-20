import { bandTone } from "@/lib/format";
import type { MatchResult } from "@/lib/matching/types";

/** Why: score + band together tell a matchmaker whether to spend the next five minutes here. */
export function MatchScoreBadge({ result }: { result: MatchResult }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-serif text-2xl text-rose-800">{result.total}</span>
      <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${bandTone(result.band)}`}>
        {result.band}
      </span>
    </div>
  );
}
