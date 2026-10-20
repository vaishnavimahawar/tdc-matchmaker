export type {
  DimensionScore,
  Knockout,
  MatchResult,
  PairSummary,
  Profile,
  RankedMatch,
} from "./types";
export { WEIGHTS } from "./weights";
export { getKnockouts } from "./knockouts";
export { scoreMatch, weightedTotal, bandFor } from "./score";
export { rankMatches, rankUniquePairs } from "./rank";
