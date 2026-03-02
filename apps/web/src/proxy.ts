import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import type { SessionDataPayload } from "@/features/auth/types";
import {
  selectActiveOrganisationPath,
  signInPath,
  signUpPath,
  ticketsByOrganisationPath,
  ticketsPath,
} from "@/path";
import type { Maybe } from "./types";
import { tryCatch } from "./utils/try-catch";

const SESSION_DATA_COOKIE_NAME = "better-auth.session_data";

const TICKET_EDIT_RE = /^\/tickets\/[^/]+\/edit$/;

const isProtectedPath = (pathname: string): boolean =>
  pathname.startsWith("/account") ||
  pathname.startsWith("/organisations") ||
  TICKET_EDIT_RE.test(pathname) ||
  pathname === ticketsPath() ||
  pathname.startsWith(ticketsByOrganisationPath());

const isAuthRoute = (pathname: string): boolean =>
  pathname === signInPath() || pathname === signUpPath();

const isOnboardingPath = (pathname: string): boolean =>
  pathname.startsWith("/onboarding");

const getSessionFromJwt = async (
  token: string,
): Promise<Maybe<SessionDataPayload>> => {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    return null;
  }

  const { data } = await tryCatch(() =>
    jwtVerify<SessionDataPayload>(token, new TextEncoder().encode(secret)),
  );
  return data?.payload;
};

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_DATA_COOKIE_NAME)?.value;
  const sessionPayload = token ? await getSessionFromJwt(token) : null;
  const hasSession = sessionPayload != null;
  const activeOrganizationId =
    sessionPayload?.session?.activeOrganizationId ?? null;

  if (isProtectedPath(pathname) && !hasSession) {
    const signInUrl = new URL(signInPath(), request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedPath(pathname) && hasSession) {
    if (isOnboardingPath(pathname)) {
      return NextResponse.next();
    }
    if (!activeOrganizationId) {
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
