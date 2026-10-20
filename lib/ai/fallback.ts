import type { MatchResult, Profile } from "@/lib/matching/types";

type RationaleInput = {
  seeker: Profile;
  candidate: Profile;
  match: MatchResult;
};

/** Why: fallback copy should read like a desk note, not a database dump. */
function fullName(profile: Profile): string {
  return `${profile.firstName} ${profile.lastName}`;
}

/** Why: matchmakers still need talking points when no LLM key is configured. */
export function ruleBasedRationale({ seeker, candidate, match }: RationaleInput): string {
  const top = [...match.dimensions].sort((a, b) => b.score - a.score).slice(0, 3);
  const weak = [...match.dimensions].sort((a, b) => a.score - b.score).slice(0, 2);

  const strengths = top.map((d) => `${d.label.toLowerCase()} (${d.reason})`).join("; ");
  const cautions = weak.map((d) => `${d.label.toLowerCase()} (${d.reason})`).join("; ");

  return [
    `${fullName(seeker)} and ${fullName(candidate)} score ${match.total} — a ${match.band} fit on paper.`,
    `Lead with: ${strengths}.`,
    `Name early: ${cautions}.`,
    `Matchmaker notes — ${seeker.firstName}: ${seeker.matchmakerNotes} ${candidate.firstName}: ${candidate.matchmakerNotes}`,
    `Suggested opener: ask how they feel about living in ${candidate.city} vs ${seeker.city}, then move to family setup (${seeker.familyType} / ${candidate.familyType}).`,
  ].join("\n\n");
}
