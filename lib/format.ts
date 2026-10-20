import type { MatchResult, Profile } from "@/lib/matching/types";

/** Why: matchmakers scan names quickly; keep display formatting out of scoring. */
export function displayName(profile: Profile): string {
  return `${profile.firstName} ${profile.lastName}`;
}

/** Why: initials give a warm avatar without storing photos in the MVP. */
export function initials(profile: Profile): string {
  return `${profile.firstName[0]}${profile.lastName[0]}`;
}

/** Why: diet enums are stored machine-friendly but should read naturally on cards. */
export function prettyDiet(diet: Profile["diet"]): string {
  if (diet === "non_veg") return "Non-veg";
  if (diet === "eggetarian") return "Eggetarian";
  if (diet === "jain") return "Jain";
  return "Vegetarian";
}

/** Why: status chips should sound like a desk, not a CRM. */
export function prettyStatus(status: Profile["status"]): string {
  if (status === "intro_pending") return "Intro pending";
  if (status === "on_hold") return "On hold";
  return "Active";
}

/** Why: format raw marital status enum into a human-readable title. */
export function prettyMaritalStatus(status: Profile["maritalStatus"]): string {
  if (status === "never_married") return "Never married";
  if (status === "divorced") return "Divorced";
  if (status === "widowed") return "Widowed";
  return status;
}

/** Why: height is stored in cm for scoring later, shown in feet for Indian biodata habit. */
export function prettyHeight(cm: number): string {
  const inchesTotal = cm / 2.54;
  const feet = Math.floor(inchesTotal / 12);
  const inches = Math.round(inchesTotal % 12);
  return `${feet}'${inches}"`;
}

/** Why: band colour is a visual shortcut during a busy call. */
export function bandTone(band: MatchResult["band"]): string {
  if (band === "exceptional") return "bg-rose-700 text-white";
  if (band === "strong") return "bg-rose-100 text-rose-900";
  if (band === "consider") return "bg-amber-100 text-amber-900";
  if (band === "weak") return "bg-stone-100 text-stone-600";
  return "bg-stone-200 text-stone-500";
}
