import type { Knockout, Profile } from "./types";

/** Why: same-person and same-gender pairs are never shown, so scoring stays about real introductions. */
export function getKnockouts(a: Profile, b: Profile): Knockout[] {
  const knockouts: Knockout[] = [];

  if (a.id === b.id) {
    knockouts.push({
      code: "same_person",
      reason: "A profile cannot be matched with itself.",
    });
  }

  if (a.gender === b.gender) {
    knockouts.push({
      code: "same_gender",
      reason: "This book currently introduces women and men to each other.",
    });
  }

  return knockouts;
}
