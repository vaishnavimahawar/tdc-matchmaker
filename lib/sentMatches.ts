import type { Profile } from "@/lib/matching/types";

export const SENT_MATCHES_KEY = "tdc-sent-matches";

// In-memory fallback if localStorage is unavailable
let memorySentMatches: string[] = [];

/** Why: construct consistent key for tracking when a specific candidate was sent to a seeker. */
export function matchSentKey(seekerId: string, candidateId: string): string {
  return `${seekerId}__${candidateId}`;
}

/** Why: return realistic contact email for the customer if not explicitly in profile. */
export function getCustomerEmail(profile: Profile): string {
  if (profile.email) return profile.email;
  const cleanFirst = profile.firstName.toLowerCase().replace(/[^a-z]/g, "");
  const cleanLast = profile.lastName.toLowerCase().replace(/[^a-z]/g, "");
  return `${cleanFirst}.${cleanLast}@gmail.com`;
}

/** Why: read sent matches from localStorage with fallback for server-side rendering. */
export function readSentMatches(): string[] {
  if (typeof window === "undefined") return memorySentMatches;
  try {
    const raw = window.localStorage.getItem(SENT_MATCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : memorySentMatches;
  } catch {
    return memorySentMatches;
  }
}

/** Why: record sent match so the matchmaker immediately sees which profiles were shared. */
export function markMatchAsSent(seekerId: string, candidateId: string): string[] {
  const key = matchSentKey(seekerId, candidateId);
  const current = readSentMatches();
  if (current.includes(key)) return current;

  const next = [...current, key];
  memorySentMatches = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SENT_MATCHES_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors in private browsing
    }
  }
  return next;
}

/** Why: quick check if candidate has already been sent to this seeker. */
export function isMatchSent(
  seekerId: string,
  candidateId: string,
  sentList?: string[]
): boolean {
  const list = sentList ?? readSentMatches();
  return list.includes(matchSentKey(seekerId, candidateId));
}
