import Link from "next/link";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { getPool } from "@/lib/data/profiles";
import { displayName } from "@/lib/format";
import { rankUniquePairs } from "@/lib/matching";

/** Why: a global pair list helps a matchmaker hunt for easy wins across the candidate pool. */
export default function MatchesPage() {
  const pairs = rankUniquePairs(getPool()).slice(0, 16);

  return (
    <div>
      <h1 className="font-serif text-4xl text-stone-900">Top pairs</h1>
      <p className="mt-2 mb-8 max-w-2xl text-stone-600">
        Unique opposite-gender pairs, highest score first. Open a pair for the full breakdown and intro brief.
      </p>
      <div className="space-y-3">
        {pairs.map(({ a, b, result }) => (
          <Link
            key={`${a.id}-${b.id}`}
            href={`/pairs/${a.id}/${b.id}`}
            className="flex flex-col gap-3 rounded-3xl border border-rose-100 bg-white p-5 hover:border-rose-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-serif text-lg text-stone-900">
                {displayName(a)} <span className="text-rose-300">×</span> {displayName(b)}
              </p>
              <p className="text-sm text-stone-500">
                {a.community} in {a.city} · {b.community} in {b.city}
              </p>
            </div>
            <MatchScoreBadge result={result} />
          </Link>
        ))}
      </div>
    </div>
  );
}
