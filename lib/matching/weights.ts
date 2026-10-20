import type { DimensionKey } from "./types";

/** Why: keep weights in one place so a matchmaker can change priorities without touching formulas. */
export const WEIGHTS: Record<DimensionKey, number> = {
  age: 16,
  location: 14,
  community: 18,
  gotra: 8,
  education: 12,
  work: 8,
  diet: 8,
  family: 6,
  language: 5,
  values: 5,
};

/** Why: Indian metros often accept a move between these cities even when hometowns differ. */
export const METROS = new Set([
  "Delhi",
  "Gurgaon",
  "Noida",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
]);
