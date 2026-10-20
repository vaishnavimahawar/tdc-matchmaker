/** Why: these specs lock the scoring stories matchmakers will hear; run them with a TypeScript-aware test runner. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { getKnockouts } from "./knockouts";
import { rankMatches } from "./rank";
import { scoreMatch, weightedTotal } from "./score";
import type { Profile } from "./types";

/** Why: load JSON via fs so the test runner does not depend on the Next path alias. */
function loadProfiles(): Profile[] {
  const file = join(dirname(fileURLToPath(import.meta.url)), "../../data/profiles.json");
  return JSON.parse(readFileSync(file, "utf8")) as Profile[];
}

/** Why: Agarwal pair with different gotras should land in the strong band for the demo book. */
test("Ananya and Arjun score as a strong community match", () => {
  const profiles = loadProfiles();
  const ananya = profiles.find((p) => p.id === "ananya-sharma");
  const arjun = profiles.find((p) => p.id === "arjun-malhotra");
  assert.ok(ananya && arjun);
  const result = scoreMatch(ananya, arjun);
  assert.equal(result.eligible, true);
  assert.ok(result.total >= 72);
  const gotra = result.dimensions.find((d) => d.key === "gotra");
  assert.equal(gotra?.score, 100);
});

/** Why: same-gotra Reddy pair must stay visible but flagged, so matchmakers do not introduce them by accident. */
test("Kavya and Nikhil are penalised for the same gotra", () => {
  const profiles = loadProfiles();
  const kavya = profiles.find((p) => p.id === "kavya-reddy");
  const nikhil = profiles.find((p) => p.id === "nikhil-reddy");
  assert.ok(kavya && nikhil);
  const result = scoreMatch(kavya, nikhil);
  const gotra = result.dimensions.find((d) => d.key === "gotra");
  assert.equal(gotra?.score, 0);
});

/** Why: knockouts must not leak into ranked suggestions. */
test("rankMatches hides same-gender and self matches", () => {
  const profiles = loadProfiles();
  const meera = profiles.find((p) => p.id === "meera-iyer");
  assert.ok(meera);
  const ranked = rankMatches(meera, profiles);
  assert.ok(ranked.every((row) => row.candidate.gender !== meera.gender));
  assert.ok(ranked.every((row) => row.candidate.id !== meera.id));
  assert.equal(getKnockouts(meera, meera).length > 0, true);
});

/** Why: the weighted average is the contract we explain to matchmakers. */
test("weightedTotal is a rounded weighted average", () => {
  const total = weightedTotal([
    { score: 100, weight: 1 },
    { score: 0, weight: 1 },
  ]);
  assert.equal(total, 50);
});
