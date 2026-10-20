export type Gender = "woman" | "man";

export type Diet = "veg" | "non_veg" | "jain" | "eggetarian";

export type FamilyType = "joint" | "nuclear" | "flexible";

export type Values = "traditional" | "balanced" | "progressive";

export type MaritalStatus = "never_married" | "divorced" | "widowed";

export type ProfileStatus = "active" | "on_hold" | "intro_pending";

export type OccupationBucket =
  | "tech"
  | "business"
  | "medicine"
  | "finance"
  | "creative"
  | "public"
  | "other";

export type PartnerPreferences = {
  ageMin: number;
  ageMax: number;
  cities: string[];
  communities: string[];
  diets: Diet[];
  familyTypes: FamilyType[];
  minEducationRank: number;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  heightCm: number;
  city: string;
  state: string;
  community: string;
  gotra?: string;
  motherTongue: string;
  education: string;
  educationRank: number;
  occupation: string;
  occupationBucket: OccupationBucket;
  incomeLakh?: number;
  maritalStatus: MaritalStatus;
  familyType: FamilyType;
  diet: Diet;
  values: Values;
  bio: string;
  preferences: PartnerPreferences;
  matchmakerNotes: string;
  status: ProfileStatus;
};

export type DimensionKey =
  | "age"
  | "location"
  | "community"
  | "gotra"
  | "education"
  | "work"
  | "diet"
  | "family"
  | "language"
  | "values";

export type DimensionScore = {
  key: DimensionKey;
  label: string;
  /** 0–100 so matchmakers can read a dimension without doing math. */
  score: number;
  weight: number;
  reason: string;
};

export type Knockout = {
  code: "same_person" | "same_gender";
  reason: string;
};

export type MatchResult = {
  eligible: boolean;
  total: number;
  band: "exceptional" | "strong" | "consider" | "weak" | "ineligible";
  dimensions: DimensionScore[];
  knockouts: Knockout[];
};

export type RankedMatch = {
  candidate: Profile;
  result: MatchResult;
};

export type PairSummary = {
  a: Profile;
  b: Profile;
  result: MatchResult;
};
