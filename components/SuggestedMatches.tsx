"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { displayName } from "@/lib/format";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { SendMatchModal } from "@/components/SendMatchModal";
import {
  getCustomerEmail,
  isMatchSent,
  markMatchAsSent,
  readSentMatches,
} from "@/lib/sentMatches";
import type { MatchResult, Profile, RankedMatch } from "@/lib/matching/types";

export type SuggestedMatchesProps = {
  seeker: Profile;
  matches: RankedMatch[];
};

type ActiveModalState = {
  candidate: Profile;
  match: MatchResult;
} | null;

/** Why: manage interactive state for match dispatching, modal composition, and toast notifications. */
export function SuggestedMatches({ seeker, matches }: SuggestedMatchesProps) {
  const [sentKeys, setSentKeys] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModalState>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage on client mount
  useEffect(() => {
    setSentKeys(readSentMatches());
  }, []);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  function handleOpenModal(
    e: React.MouseEvent,
    candidate: Profile,
    match: MatchResult
  ) {
    e.preventDefault();
    e.stopPropagation();
    setActiveModal({ candidate, match });
  }

  function handleConfirmSend(seekerProfile: Profile, candidateProfile: Profile) {
    const updated = markMatchAsSent(seekerProfile.id, candidateProfile.id);
    setSentKeys(updated);
    setActiveModal(null);

    const email = getCustomerEmail(seekerProfile);
    setToastMessage(
      `Match introduction successfully sent to ${seekerProfile.firstName} (${email})!`
    );
  }

  return (
    <section className="relative">
      {/* Toast Notification */}
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 shadow-[0_12px_30px_rgba(16,185,129,0.15)] transition-all animate-bounce-once"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold">
            ✓
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-900">Match Dispatched</p>
            <p className="text-xs text-stone-600">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-stone-700"
            aria-label="Dismiss toast"
          >
            ×
          </button>
        </div>
      ) : null}

      <h2 className="font-serif text-2xl text-stone-900">Suggested matches</h2>
      <p className="mt-1 mb-4 text-sm text-stone-500">
        Ranked from the 120 candidate pool. Send curated match emails or open pair breakdown.
      </p>

      <div className="space-y-3">
        {matches.map(({ candidate, result }) => {
          const sent = isMatchSent(seeker.id, candidate.id, sentKeys);

          return (
            <Link
              key={candidate.id}
              href={`/pairs/${seeker.id}/${candidate.id}`}
              className="group block rounded-3xl border border-rose-100 bg-white p-5 transition hover:border-rose-200 hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-lg text-stone-900 group-hover:text-rose-800 transition">
                      {displayName(candidate)}
                    </p>
                    {candidate.verified ? (
                      <span
                        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                        title="Verified Biodata"
                      >
                        ✓ Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-stone-500">
                    {candidate.age} yrs · {candidate.city} · {candidate.occupation}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <MatchScoreBadge result={result} />

                  {/* Send Match Action Button */}
                  {sent ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Sent
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOpenModal(e, candidate, result)}
                      className="rounded-full border border-rose-200 bg-rose-50/70 px-3.5 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-rose-800 hover:text-white"
                    >
                      Send Match
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-rose-50 pt-2.5 text-xs text-stone-500">
                <span className="line-clamp-1">{result.dimensions[0]?.reason}</span>
                <span className="text-rose-700 shrink-0 font-medium ml-2 group-hover:underline">
                  View Pair →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {activeModal ? (
        <SendMatchModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onConfirmSend={handleConfirmSend}
          seeker={seeker}
          candidate={activeModal.candidate}
          match={activeModal.match}
        />
      ) : null}
    </section>
  );
}
