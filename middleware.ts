import { NextRequest, NextResponse } from "next/server";

/** Why: the cookie name must match lib/auth.ts; duplicating the const avoids an import that pulls in server-only code. */
const SESSION_COOKIE = "tdc-session";

/** Why: login and its API must stay accessible to unauthenticated users. */
const PUBLIC_PATHS = ["/login", "/api/login"];

/** Why: middleware runs on the edge before every request, making it the right place for auth guards. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /** Why: static assets and Next internals should never be intercepted. */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (isPublic) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    /** Why: redirect preserves the intended destination so we could add ?next= later. */
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/** Why: a matcher keeps middleware from running on static file requests, which saves edge compute. */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
