import type { DimensionScore, Profile } from "./types";
import { METROS, WEIGHTS } from "./weights";

/** Why: dimension scores stay on a 0–100 scale so weights remain the only dial. */
function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Why: a tiny helper keeps preference lookups readable inside scoring rules. */
function prefer(profile: Profile) {
  return profile.preferences;
}

/** Why: both families usually have an age window; we score the overlap, not a single number. */
export function scoreAge(a: Profile, b: Profile): DimensionScore {
  const aFitsB = b.age >= prefer(a).ageMin && b.age <= prefer(a).ageMax;
  const bFitsA = a.age >= prefer(b).ageMin && a.age <= prefer(b).ageMax;
  const gap = Math.abs(a.age - b.age);

  let score = 40;
  let reason = `Age gap is ${gap} years.`;

  if (aFitsB && bFitsA) {
    score = 100;
    reason = `Both sit inside each other's preferred age window (${gap}-year gap).`;
  } else if (aFitsB || bFitsA) {
    score = 72;
    reason = `One side's age window fits; the other will need a conversation.`;
  } else if (gap <= 2) {
    score = 58;
    reason = `Close in age, but both windows need stretching.`;
  } else if (gap <= 6) {
    score = 35;
    reason = `Age gap is workable only if both families are flexible.`;
  } else {
    score = 12;
    reason = `Age is a likely family objection.`;
  }

  const woman = a.gender === "woman" ? a : b;
  const man = a.gender === "man" ? a : b;
  if (man.age - woman.age >= 0 && man.age - woman.age <= 6 && score >= 58) {
    score = clamp(score + 4);
    reason += " Traditional age order also holds.";
  }

  return { key: "age", label: "Age", score: clamp(score), weight: WEIGHTS.age, reason };
}

/** Why: relocation is one of the first practical questions on an intro call. */
export function scoreLocation(a: Profile, b: Profile): DimensionScore {
  let score = 22;
  let reason = `${a.city} and ${b.city} would need a move or long commute.`;

  if (a.city === b.city) {
    score = 100;
    reason = `Both are in ${a.city}, so logistics are easy.`;
  } else if (a.state === b.state) {
    score = 78;
    reason = `Same state (${a.state}), different cities.`;
  } else if (METROS.has(a.city) && METROS.has(b.city)) {
    score = 62;
    reason = `Both live in metros (${a.city} / ${b.city}), so a move is more plausible.`;
  }

  const aWantsB = prefer(a).cities.length === 0 || prefer(a).cities.includes(b.city);
  const bWantsA = prefer(b).cities.length === 0 || prefer(b).cities.includes(a.city);
  if (aWantsB && bWantsA && score < 100) {
    score = clamp(score + 12);
    reason += " City lists already include each other.";
  } else if (!aWantsB && !bWantsA && a.city !== b.city) {
    score = clamp(score - 18);
    reason += " Neither list currently includes the other's city.";
  }

  return { key: "location", label: "Location", score: clamp(score), weight: WEIGHTS.location, reason };
}

/** Why: community is often a family gate, even when the clients themselves are flexible. */
export function scoreCommunity(a: Profile, b: Profile): DimensionScore {
  const same = a.community === b.community;
  const aOpen = prefer(a).communities.length === 0;
  const bOpen = prefer(b).communities.length === 0;
  const aWants = aOpen || prefer(a).communities.includes(b.community);
  const bWants = bOpen || prefer(b).communities.includes(a.community);

  if (same && aWants && bWants) {
    return {
      key: "community",
      label: "Community",
      score: 100,
      weight: WEIGHTS.community,
      reason: `Same community (${a.community}) and both families asked for it.`,
    };
  }

  if (same) {
    return {
      key: "community",
      label: "Community",
      score: 88,
      weight: WEIGHTS.community,
      reason: `Same community (${a.community}), even if one side listed a wider net.`,
    };
  }

  if (aWants && bWants) {
    return {
      key: "community",
      label: "Community",
      score: 54,
      weight: WEIGHTS.community,
      reason: `${a.community} and ${b.community} differ, but preference lists still allow it.`,
    };
  }

  return {
    key: "community",
    label: "Community",
    score: 18,
    weight: WEIGHTS.community,
    reason: `Community mismatch (${a.community} / ${b.community}) is likely to stall with parents.`,
  };
}

/** Why: many Brahmin and North Indian families treat same-gotra as a hard no. */
export function scoreGotra(a: Profile, b: Profile): DimensionScore {
  if (!a.gotra || !b.gotra) {
    return {
      key: "gotra",
      label: "Gotra",
      score: 70,
      weight: WEIGHTS.gotra,
      reason: "Gotra is not recorded for both, so this is treated as neutral.",
    };
  }

  if (a.gotra === b.gotra) {
    return {
      key: "gotra",
      label: "Gotra",
      score: 0,
      weight: WEIGHTS.gotra,
      reason: `Same gotra (${a.gotra}) — skip unless both families explicitly waive this.`,
    };
  }

  return {
    key: "gotra",
    label: "Gotra",
    score: 100,
    weight: WEIGHTS.gotra,
    reason: `Different gotras (${a.gotra} / ${b.gotra}).`,
  };
}

/** Why: education is used as a proxy for conversation and family prestige, not as a caste of degrees. */
export function scoreEducation(a: Profile, b: Profile): DimensionScore {
  const gap = Math.abs(a.educationRank - b.educationRank);
  const meetsA = b.educationRank >= prefer(a).minEducationRank;
  const meetsB = a.educationRank >= prefer(b).minEducationRank;

  let score = 70;
  if (gap === 0) score = 96;
  else if (gap === 1) score = 82;
  else if (gap === 2) score = 58;
  else score = 32;

  if (!meetsA || !meetsB) {
    score = Math.min(score, 40);
  }

  const reason =
    meetsA && meetsB
      ? `${a.education} and ${b.education} are close enough that education should not block the intro.`
      : `One side asked for a higher education bar than the other's recorded rank.`;

  return {
    key: "education",
    label: "Education",
    score: clamp(score),
    weight: WEIGHTS.education,
    reason,
  };
}

/** Why: similar work worlds reduce lifestyle shock (hours, travel, money talk). */
export function scoreWork(a: Profile, b: Profile): DimensionScore {
  const same = a.occupationBucket === b.occupationBucket;
  const allied =
    (a.occupationBucket === "finance" && b.occupationBucket === "business") ||
    (a.occupationBucket === "business" && b.occupationBucket === "finance") ||
    (a.occupationBucket === "tech" && b.occupationBucket === "finance");

  const score = same ? 92 : allied ? 74 : 48;
  const reason = same
    ? `Both sit in ${a.occupationBucket} (${a.occupation} / ${b.occupation}).`
    : allied
      ? `Adjacent work worlds (${a.occupation} / ${b.occupation}).`
      : `Different work rhythms (${a.occupation} / ${b.occupation}) — flag lifestyle on the call.`;

  return { key: "work", label: "Work", score, weight: WEIGHTS.work, reason };
}

/** Why: food rules are daily and public in Indian homes; mismatch becomes a first-week fight. */
export function scoreDiet(a: Profile, b: Profile): DimensionScore {
  const aOk = prefer(a).diets.length === 0 || prefer(a).diets.includes(b.diet);
  const bOk = prefer(b).diets.length === 0 || prefer(b).diets.includes(a.diet);
  const same = a.diet === b.diet;
  const vegFamily =
    (a.diet === "veg" && b.diet === "jain") || (a.diet === "jain" && b.diet === "veg");

  let score = 30;
  let reason = `Diet differs (${a.diet.replace("_", "-")} / ${b.diet.replace("_", "-")}).`;

  if (same && aOk && bOk) {
    score = 100;
    reason = `Same diet (${a.diet.replace("_", "-")}) and both asked for it.`;
  } else if (same) {
    score = 88;
    reason = `Same diet (${a.diet.replace("_", "-")}).`;
  } else if (vegFamily && aOk && bOk) {
    score = 76;
    reason = "Veg / Jain kitchens can usually share a home with clear rules.";
  } else if (aOk && bOk) {
    score = 58;
    reason += " Preference lists still allow it.";
  } else {
    score = 16;
    reason += " At least one family listed this as a likely no.";
  }

  return { key: "diet", label: "Diet", score, weight: WEIGHTS.diet, reason };
}

/** Why: joint vs nuclear is often the real negotiation, not the biodata headline. */
export function scoreFamily(a: Profile, b: Profile): DimensionScore {
  const aOk =
    prefer(a).familyTypes.length === 0 || prefer(a).familyTypes.includes(b.familyType);
  const bOk =
    prefer(b).familyTypes.length === 0 || prefer(b).familyTypes.includes(a.familyType);
  const same = a.familyType === b.familyType;
  const flexible = a.familyType === "flexible" || b.familyType === "flexible";

  let score = 40;
  if (same && aOk && bOk) score = 100;
  else if (flexible && aOk && bOk) score = 80;
  else if (aOk && bOk) score = 64;
  else score = 28;

  const reason = same
    ? `Both describe ${a.familyType} family life.`
    : `${a.familyType} vs ${b.familyType} — confirm who they would live with after marriage.`;

  return { key: "family", label: "Family", score, weight: WEIGHTS.family, reason };
}

/** Why: a shared language makes the first family call less awkward. */
export function scoreLanguage(a: Profile, b: Profile): DimensionScore {
  const same = a.motherTongue === b.motherTongue;
  return {
    key: "language",
    label: "Language",
    score: same ? 100 : 42,
    weight: WEIGHTS.language,
    reason: same
      ? `Shared mother tongue (${a.motherTongue}).`
      : `${a.motherTongue} and ${b.motherTongue} differ; check the language of family calls.`,
  };
}

/** Why: value alignment predicts whether "modern vs traditional" becomes a fight after the intro. */
export function scoreValues(a: Profile, b: Profile): DimensionScore {
  if (a.values === b.values) {
    return {
      key: "values",
      label: "Values",
      score: 100,
      weight: WEIGHTS.values,
      reason: `Both lean ${a.values}.`,
    };
  }

  const includesBalanced = a.values === "balanced" || b.values === "balanced";
  const poles =
    (a.values === "traditional" && b.values === "progressive") ||
    (a.values === "progressive" && b.values === "traditional");

  return {
    key: "values",
    label: "Values",
    score: poles ? 28 : includesBalanced ? 70 : 50,
    weight: WEIGHTS.values,
    reason: poles
      ? "Traditional vs progressive — name this on the call before families meet."
      : `${a.values} and ${b.values} can meet in the middle with a clear conversation.`,
  };
}

/** Why: one list of scorers keeps scoreMatch a thin orchestrator. */
export function scoreAllDimensions(a: Profile, b: Profile): DimensionScore[] {
  return [
    scoreAge(a, b),
    scoreLocation(a, b),
    scoreCommunity(a, b),
    scoreGotra(a, b),
    scoreEducation(a, b),
    scoreWork(a, b),
    scoreDiet(a, b),
    scoreFamily(a, b),
    scoreLanguage(a, b),
    scoreValues(a, b),
  ];
}
