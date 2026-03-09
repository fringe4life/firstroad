import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/features/auth/utils/get-session-cookie";
import {
  signInPath,
  signUpPath,
  ticketsByOrganisationPath,
  ticketsPath,
} from "@/path";

const TICKET_EDIT_RE = /^\/tickets\/[^/]+\/edit$/;

const isProtectedPath = (pathname: string): boolean =>
  pathname.startsWith("/account") ||
  pathname.startsWith("/organisations") ||
  TICKET_EDIT_RE.test(pathname) ||
  pathname === ticketsPath() ||
  pathname.startsWith(ticketsByOrganisationPath());

const isAuthRoute = (pathname: string): boolean =>
  pathname === signInPath() || pathname === signUpPath();

export const proxy = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  // Optimistic only: presence of session token cookie (name from NEXT_PUBLIC_SESSION_TOKEN_COOKIE_NAME).
  // No DB lookup or token validation; actual auth checks are at page level.
  const hasSession = Boolean(getSessionCookie(request));

  if (isProtectedPath(pathname) && !hasSession) {
    const signInUrl = new URL(signInPath(), request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/onboarding/:path*",
    "/account/:path*",
    "/tickets",
    "/tickets/organisation/:path*",
    "/tickets/:path*/edit",
    "/organisations/:path*",
  ],
};
