import type { MatchResult, Profile } from "@/lib/matching/types";
import { ruleBasedRationale } from "./fallback";

export type RationaleInput = {
  seeker: Profile;
  candidate: Profile;
  match: MatchResult;
};

export type RationaleResult = {
  text: string;
  source: "llm" | "fallback";
  model?: string;
};

type Env = NodeJS.ProcessEnv;

/** Why: one prompt keeps provider swaps from changing what matchmakers see. */
function buildPrompt({ seeker, candidate, match }: RationaleInput): string {
  const dimensions = match.dimensions
    .map((d) => `- ${d.label}: ${d.score}/100 — ${d.reason}`)
    .join("\n");

  return `You are an assistant for an Indian matchmaker. Write 3 short paragraphs of talking points for an intro call.
Be warm, specific, and practical. Do not invent facts. Do not mention caste hierarchy. Flag family objections plainly.

Seeker: ${seeker.firstName} ${seeker.lastName}, ${seeker.age}, ${seeker.city}, ${seeker.community}, ${seeker.education}, ${seeker.occupation}, ${seeker.diet}, ${seeker.familyType}. Notes: ${seeker.matchmakerNotes}
Candidate: ${candidate.firstName} ${candidate.lastName}, ${candidate.age}, ${candidate.city}, ${candidate.community}, ${candidate.education}, ${candidate.occupation}, ${candidate.diet}, ${candidate.familyType}. Notes: ${candidate.matchmakerNotes}
Score: ${match.total} (${match.band})
Breakdown:
${dimensions}`;
}

/**
 * Why: isolating the HTTP call lets you swap OpenAI, Groq, or a local model without touching the app.
 * Return null to trigger the rule-based fallback.
 */
async function completePrompt(prompt: string, env: Env): Promise<{ text: string; model: string } | null> {
  const apiKey = env.LLM_API_KEY || env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = env.LLM_MODEL || "gpt-4o-mini";
  const baseUrl = (env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "You write concise talking points for professional Indian matchmakers.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM provider returned ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("LLM provider returned an empty message");
  return { text, model };
}

/** Why: the rest of the app should never branch on vendors — only call this. */
export async function generateMatchRationale(
  input: RationaleInput,
  env: Env = process.env,
): Promise<RationaleResult> {
  try {
    const llm = await completePrompt(buildPrompt(input), env);
    if (!llm) {
      return { text: ruleBasedRationale(input), source: "fallback" };
    }
    return { text: llm.text, source: "llm", model: llm.model };
  } catch {
    return { text: ruleBasedRationale(input), source: "fallback" };
  }
}
