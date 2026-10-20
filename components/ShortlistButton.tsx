"use client";

import { useEffect, useState } from "react";
import { readShortlist, toggleShortlist } from "@/lib/shortlist";

/** Why: starring a pair is local-only so the MVP can work without a database. */
export function ShortlistButton({ pairKey }: { pairKey: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readShortlist().includes(pairKey));
  }, [pairKey]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleShortlist(pairKey).includes(pairKey))}
      className={`rounded-full border px-4 py-2 text-sm ${
        saved
          ? "border-rose-300 bg-rose-50 text-rose-800"
          : "border-rose-100 bg-white text-stone-600 hover:border-rose-200"
      }`}
    >
      {saved ? "On today's shortlist" : "Save to shortlist"}
    </button>
  );
}
