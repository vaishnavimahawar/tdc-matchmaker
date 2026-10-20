import { NextResponse } from "next/server";
import { getProfileById } from "@/lib/data/profiles";

/** Why: profile detail clients should fail loudly on unknown ids instead of returning an empty card. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const profile = getProfileById(id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json({ profile });
}
