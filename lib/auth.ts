import { cookies } from "next/headers";
import matchmakersJson from "@/data/matchmakers.json";

/** Why: a typed wrapper keeps all auth logic in one file and avoids raw JSON imports everywhere. */
export type Matchmaker = {
  id: string;
  username: string;
  password: string;
  displayName: string;
};

/** Why: centralised constant prevents typos when reading/writing the session cookie. */
export const SESSION_COOKIE = "tdc-session";

/** Why: hardcoded list is the simplest auth source for an internal MVP. */
export function getMatchmakers(): Matchmaker[] {
  return matchmakersJson as Matchmaker[];
}

/** Why: login needs a single lookup; this isolates the search logic. */
export function findMatchmaker(
  username: string,
  password: string,
): Matchmaker | undefined {
  return getMatchmakers().find(
    (m) => m.username === username && m.password === password,
  );
}

/** Why: server components and API routes should have one call to read the current user. */
export async function currentUser(): Promise<Matchmaker | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getMatchmakers().find((m) => m.id === token) ?? null;
}
