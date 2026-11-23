import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, readTokenFromCookieValue } from "@/lib/auth-cookie";

/** Pages that need a signed-in user. */
const PROTECTED = ["/add-post", "/profile"];
/** Pages a signed-in user has no reason to see. */
const GUEST_ONLY = ["/login", "/register"];

const matches = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

/**
 * Route protection on the server (Next.js 16 Proxy): protected pages never
 * render for guests, instead of only hiding buttons on the client.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = readTokenFromCookieValue(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (!token && PROTECTED.some((p) => matches(pathname, p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (token && GUEST_ONLY.includes(pathname)) {
    const redirect = request.nextUrl.searchParams.get("redirect");
    const safe = redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
    return NextResponse.redirect(new URL(safe, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-post/:path*", "/profile/:path*", "/login", "/register"],
};
