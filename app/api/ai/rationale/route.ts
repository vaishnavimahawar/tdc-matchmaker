import { NextResponse } from "next/server";
import { generateMatchRationale } from "@/lib/ai/provider";
import { getProfileById } from "@/lib/data/profiles";
import { scoreMatch } from "@/lib/matching";

/** Why: LLM keys stay on the server; the browser only receives the finished talking points. */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    seekerId?: string;
    candidateId?: string;
  };

  if (!body.seekerId || !body.candidateId) {
    return NextResponse.json(
      { error: "seekerId and candidateId are required" },
      { status: 400 },
    );
  }

  const seeker = getProfileById(body.seekerId);
  const candidate = getProfileById(body.candidateId);
  if (!seeker || !candidate) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const match = scoreMatch(seeker, candidate);
  if (!match.eligible) {
    return NextResponse.json({ error: "Pair is not eligible" }, { status: 400 });
  }

  const rationale = await generateMatchRationale({ seeker, candidate, match });
  return NextResponse.json(rationale);
}
