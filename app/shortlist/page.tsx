"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { getProfiles } from "@/lib/data/profiles";
import { displayName } from "@/lib/format";
import { scoreMatch } from "@/lib/matching";
import { pairKey, readShortlist, toggleShortlist } from "@/lib/shortlist";

/** Why: the shortlist is a personal scratchpad, so it lives in this browser rather than JSON. */
export default function ShortlistPage() {
  const [keys, setKeys] = useState<string[]>([]);
  const profiles = getProfiles();

  useEffect(() => {
    setKeys(readShortlist());
  }, []);

  const pairs = keys
    .map((key) => {
      const [left, right] = key.split("__");
      const a = profiles.find((profile) => profile.id === left);
      const b = profiles.find((profile) => profile.id === right);
      if (!a || !b) return null;
      return { a, b, result: scoreMatch(a, b), key };
    })
    .filter((row) => row !== null);

  return (
    <div>
      <h1 className="font-serif text-4xl text-stone-900">Today's shortlist</h1>
      <p className="mt-2 mb-8 max-w-2xl text-stone-600">
        Saved in this browser only. Use it as a call sheet; it will not sync to another desk.
      </p>
      {pairs.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-rose-200 bg-white p-8 text-stone-500">
          No pairs starred yet. Open a pair and save it here before your evening calls.
        </p>
      ) : (
        <div className="space-y-3">
          {pairs.map((row) => (
            <div
              key={row.key}
              className="flex flex-col gap-3 rounded-3xl border border-rose-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link href={`/pairs/${row.a.id}/${row.b.id}`} className="flex-1">
                <p className="font-serif text-lg text-stone-900">
                  {displayName(row.a)} <span className="text-rose-300">×</span> {displayName(row.b)}
                </p>
                <p className="text-sm text-stone-500">
                  {row.a.city} · {row.b.city}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <MatchScoreBadge result={row.result} />
                <button
                  type="button"
                  className="text-sm text-stone-400 hover:text-rose-800"
                  onClick={() => setKeys(toggleShortlist(pairKey(row.a.id, row.b.id)))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
