import { type NextRequest, NextResponse } from "next/server";
import {
  signInPath,
  signUpPath,
  ticketsByOrganisationPath,
  ticketsPath,
} from "@/path";

const SESSION_TOKEN_COOKIE_NAME = "better-auth.session_token";

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
  const token = request.cookies.get(SESSION_TOKEN_COOKIE_NAME)?.value;

  const hasSession = token != null;

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
