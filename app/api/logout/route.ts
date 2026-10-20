import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

/** Why: clearing the cookie on a POST prevents accidental logout via link prefetch. */
export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
