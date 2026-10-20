import poolJson from "@/data/pool.json";
import profilesJson from "@/data/profiles.json";
import type { Gender, Profile } from "@/lib/matching/types";

/** Why: JSON stays the source of truth until a database exists; this wrapper keeps imports typed. */
export function getProfiles(): Profile[] {
  return profilesJson as Profile[];
}

/** Why: candidate matching pool is kept distinct from the matchmaker's 16 active customers. */
export function getPool(): Profile[] {
  return poolJson as Profile[];
}

/** Why: pages and APIs need a single lookup across customers and candidate pool so missing IDs stay consistent. */
export function getProfileById(id: string): Profile | undefined {
  return (
    getProfiles().find((profile) => profile.id === id) ||
    getPool().find((profile) => profile.id === id)
  );
}

/** Why: matching evaluates clients strictly against candidates of the opposite gender in the pool. */
export function getOppositeGenderPool(gender: Gender): Profile[] {
  const targetGender = gender === "woman" ? "man" : "woman";
  return getPool().filter((p) => p.gender === targetGender);
}

/** Why: dashboard cards should describe pipeline health without extra queries. */
export function countByStatus() {
  const profiles = getProfiles();
  return {
    total: profiles.length,
    active: profiles.filter((p) => p.status === "active").length,
    introPending: profiles.filter((p) => p.status === "intro_pending").length,
    onHold: profiles.filter((p) => p.status === "on_hold").length,
    women: profiles.filter((p) => p.gender === "woman").length,
    men: profiles.filter((p) => p.gender === "man").length,
  };
}

/** Why: matchmakers work primarily with their own book of assigned clients. */
export function getProfilesByMatchmaker(matchmakerId: string): Profile[] {
  return getProfiles().filter((profile) => profile.matchmakerId === matchmakerId);
}

/** Why: dashboard stat cards can reflect either a specific matchmaker's book or the whole desk. */
export function countByMatchmakerStatus(matchmakerId?: string) {
  const profiles = matchmakerId ? getProfilesByMatchmaker(matchmakerId) : getProfiles();
  return {
    total: profiles.length,
    active: profiles.filter((p) => p.status === "active").length,
    introPending: profiles.filter((p) => p.status === "intro_pending").length,
    onHold: profiles.filter((p) => p.status === "on_hold").length,
    women: profiles.filter((p) => p.gender === "woman").length,
    men: profiles.filter((p) => p.gender === "man").length,
  };
}
