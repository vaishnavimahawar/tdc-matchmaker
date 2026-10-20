import { scoreMatch } from "./score";
import type { PairSummary, Profile, RankedMatch } from "./types";

/** Why: matchmakers start from one client; ranking the rest of the book is the daily workflow. */
export function rankMatches(seeker: Profile, pool: Profile[]): RankedMatch[] {
  return pool
    .filter((candidate) => candidate.id !== seeker.id)
    .map((candidate) => ({
      candidate,
      result: scoreMatch(seeker, candidate),
    }))
    .filter((row) => row.result.eligible)
    .sort((left, right) => right.result.total - left.result.total);
}

/** Why: the home screen needs unique pairs, not the same couple counted twice. */
export function rankUniquePairs(pool: Profile[]): PairSummary[] {
  const pairs: PairSummary[] = [];

  for (let i = 0; i < pool.length; i += 1) {
    for (let j = i + 1; j < pool.length; j += 1) {
      const a = pool[i];
      const b = pool[j];
      const result = scoreMatch(a, b);
      if (!result.eligible) continue;
      pairs.push({ a, b, result });
    }
  }

  return pairs.sort((left, right) => right.result.total - left.result.total);
}
