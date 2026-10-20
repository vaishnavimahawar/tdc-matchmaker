import { scoreAllDimensions } from "./dimensions";
import { getKnockouts } from "./knockouts";
import type { MatchResult, Profile } from "./types";

/** Why: bands are easier to brief a family on than a raw 0–100 number. */
export function bandFor(total: number, eligible: boolean): MatchResult["band"] {
  if (!eligible) return "ineligible";
  if (total >= 85) return "exceptional";
  if (total >= 72) return "strong";
  if (total >= 58) return "consider";
  return "weak";
}

/** Why: weighted average is explainable in a meeting: every point maps to a named dimension. */
export function weightedTotal(
  dimensions: { score: number; weight: number }[],
): number {
  const weightSum = dimensions.reduce((sum, d) => sum + d.weight, 0);
  if (weightSum === 0) return 0;
  const raw = dimensions.reduce((sum, d) => sum + d.score * d.weight, 0) / weightSum;
  return Math.round(raw);
}

/** Why: this is the single scoring entry so UI, APIs, and tests never drift apart. */
export function scoreMatch(a: Profile, b: Profile): MatchResult {
  const knockouts = getKnockouts(a, b);
  const eligible = knockouts.length === 0;
  const dimensions = scoreAllDimensions(a, b);
  const total = eligible ? weightedTotal(dimensions) : 0;

  return {
    eligible,
    total,
    band: bandFor(total, eligible),
    dimensions,
    knockouts,
  };
}
