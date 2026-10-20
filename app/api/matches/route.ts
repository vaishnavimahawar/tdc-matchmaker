import { NextResponse } from "next/server";
import {
  getOppositeGenderPool,
  getPool,
  getProfileById,
  getProfiles,
} from "@/lib/data/profiles";
import { rankMatches, rankUniquePairs } from "@/lib/matching";

/** Why: scoring stays on the server so the UI cannot drift from the documented formula. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profileId");
  const limit = Number(url.searchParams.get("limit") ?? "8");

  if (profileId) {
    const seeker = getProfileById(profileId);
    if (!seeker) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const matches = rankMatches(seeker, getOppositeGenderPool(seeker.gender)).slice(0, limit);
    return NextResponse.json({
      seekerId: seeker.id,
      matches: matches.map(({ candidate, result }) => ({
        candidate,
        result,
      })),
    });
  }

  const pairs = rankUniquePairs(getPool()).slice(0, limit);
  return NextResponse.json({
    pairs: pairs.map(({ a, b, result }) => ({ a, b, result })),
  });
}
