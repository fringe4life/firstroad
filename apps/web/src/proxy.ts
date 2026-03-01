import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import {
  selectActiveOrganisationPath,
  signInPath,
  ticketsByOrganisationPath,
  ticketsPath,
} from "@/path";
import { ACTIVE_ORG_COOKIE_NAME } from "./features/organisation/constants";

const TICKET_EDIT_RE = /^\/tickets\/[^/]+\/edit$/;

const isProtectedPath = (pathname: string): boolean =>
  pathname.startsWith("/account") ||
  pathname.startsWith("/organisations") ||
  TICKET_EDIT_RE.test(pathname) ||
  pathname === ticketsPath() ||
  pathname.startsWith(ticketsByOrganisationPath());

// const isAuthRoute = (pathname: string): boolean =>
//   pathname === signInPath() || pathname === signUpPath();

const isOnboardingPath = (pathname: string): boolean =>
  pathname.startsWith("/onboarding");

export const proxy = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);

  if (isProtectedPath(pathname) && !sessionCookie) {
    const signInUrl = new URL(signInPath(), request.url);
    return NextResponse.redirect(signInUrl);
  }

  // if (isAuthRoute(pathname) && sessionCookie) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // Redirect to select-active-org when logged in, on a protected path, but no active org set
  if (isProtectedPath(pathname) && sessionCookie) {
    if (isOnboardingPath(pathname)) {
      return NextResponse.next();
    }
    const activeOrgCookie = request.cookies.get(ACTIVE_ORG_COOKIE_NAME);
    if (!activeOrgCookie?.value) {
      return NextResponse.redirect(
        new URL(selectActiveOrganisationPath(), request.url),
      );
    }
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
