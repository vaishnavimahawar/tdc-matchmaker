"use client";

import { useEffect } from "react";
import { displayName, prettyDiet, prettyHeight } from "@/lib/format";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { getCustomerEmail } from "@/lib/sentMatches";
import type { MatchResult, Profile } from "@/lib/matching/types";

export type SendMatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: (seeker: Profile, candidate: Profile) => void;
  seeker: Profile;
  candidate: Profile;
  match: MatchResult;
};

/** Why: email dispatch preview isolates the mock client correspondence in a dedicated modal dialog. */
export function SendMatchModal({
  isOpen,
  onClose,
  onConfirmSend,
  seeker,
  candidate,
  match,
}: SendMatchModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const recipientEmail = getCustomerEmail(seeker);
  const subject = `Curated Introduction: ${candidate.firstName} ${candidate.lastName} (${candidate.age}, ${candidate.city})`;
  const shortIntro = candidate.about || candidate.bio;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_20px_50px_rgba(120,70,70,0.15)] transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 bg-[#FAF4ED] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-rose-500" />
            <h2 id="modal-title" className="font-serif text-lg font-medium text-stone-900">
              Send Match Introduction
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mock Email Composition Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-4 text-sm text-stone-700">
          {/* Email Headers Box */}
          <div className="rounded-2xl border border-rose-100 bg-[#FDFBF7] p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="w-16 font-semibold uppercase tracking-wider text-xs text-stone-400">
                To:
              </span>
              <span className="font-medium text-stone-800">
                {displayName(seeker)}{" "}
                <span className="font-normal text-stone-500">&lt;{recipientEmail}&gt;</span>
              </span>
            </div>
            <div className="flex items-start gap-3 border-t border-rose-50 pt-2">
              <span className="w-16 font-semibold uppercase tracking-wider text-xs text-stone-400 pt-0.5">
                Subject:
              </span>
              <span className="font-medium text-stone-900">{subject}</span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="rounded-2xl border border-rose-100/70 bg-white p-5 space-y-4">
            <p>Dear {seeker.firstName},</p>
            <p className="text-stone-600 leading-relaxed">
              We have identified a curated matrimonial match from our book that strongly resonates with your preferences and lifestyle expectations:
            </p>

            {/* Candidate Summary Card */}
            <div className="rounded-2xl border border-rose-200/80 bg-[#FAF4ED] p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    {displayName(candidate)}
                  </h3>
                  <p className="text-xs text-rose-800 font-medium">
                    {candidate.age} yrs · {prettyHeight(candidate.heightCm)} ({candidate.heightCm} cm) · {candidate.city}, {candidate.state}
                  </p>
                </div>
                <MatchScoreBadge result={match} />
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs border-t border-rose-200/60 pt-3">
                <div>
                  <dt className="text-stone-400">Profession</dt>
                  <dd className="font-medium text-stone-800">{candidate.occupation}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Education</dt>
                  <dd className="font-medium text-stone-800">{candidate.education}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Community / Religion</dt>
                  <dd className="font-medium text-stone-800">
                    {candidate.religion || "Hindu"} · {candidate.community}
                    {candidate.gotra ? ` (${candidate.gotra})` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-400">Diet & Family</dt>
                  <dd className="font-medium text-stone-800">
                    {prettyDiet(candidate.diet)} · {candidate.familyType} setup
                  </dd>
                </div>
              </dl>

              {shortIntro ? (
                <div className="border-t border-rose-200/60 pt-2 text-xs italic text-stone-600">
                  &ldquo;{shortIntro}&rdquo;
                </div>
              ) : null}
            </div>

            <p className="text-stone-600 leading-relaxed text-xs">
              <strong>Matchmaker Note:</strong> {candidate.matchmakerNotes || "Recommended for thoughtful lifestyle alignment and family values."}
            </p>

            <div className="pt-2 text-xs text-stone-500 border-t border-rose-100">
              <p>Warm regards,</p>
              <p className="font-serif font-medium text-rose-900">The Desk Circle Matchmaking Desk</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-rose-100 bg-[#FAF4ED] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirmSend(seeker, candidate)}
            className="rounded-full bg-rose-800 px-5 py-2 text-xs font-medium text-white shadow-xs hover:bg-rose-700 transition"
          >
            Confirm & Send
          </button>
        </div>
      </div>
    </div>
  );
}
