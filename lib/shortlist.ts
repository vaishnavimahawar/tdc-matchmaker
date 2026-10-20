export const SHORTLIST_KEY = "tdc-shortlist";

/** Why: localStorage is good enough for a personal desk until notes live on a server. */
export function readShortlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Why: pair keys stay stable across reloads so a matchmaker can pick up after a call. */
export function toggleShortlist(pairKey: string): string[] {
  const current = readShortlist();
  const next = current.includes(pairKey)
    ? current.filter((key) => key !== pairKey)
    : [...current, pairKey];
  window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
  return next;
}

/** Why: a canonical key lets the same pair be saved from either person's page. */
export function pairKey(a: string, b: string): string {
  return [a, b].sort().join("__");
}
