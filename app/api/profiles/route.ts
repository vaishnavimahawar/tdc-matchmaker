import { NextResponse } from "next/server";
import { getProfiles } from "@/lib/data/profiles";

/** Why: a JSON API lets a future CRM or mobile client reuse the same book. */
export async function GET() {
  return NextResponse.json({ profiles: getProfiles() });
}
