import { NextResponse } from "next/server";
import { findMatchmaker, SESSION_COOKIE } from "@/lib/auth";

/** Why: a POST route keeps credentials out of the URL and query strings. */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!body.username || !body.password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  const matchmaker = findMatchmaker(body.username, body.password);
  if (!matchmaker) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }

  /** Why: httpOnly cookie prevents client JS from reading the token. */
  const response = NextResponse.json({
    ok: true,
    displayName: matchmaker.displayName,
  });

  response.cookies.set(SESSION_COOKIE, matchmaker.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    /** Why: 7-day expiry keeps the desk usable across browser restarts. */
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
