import { type NextRequest, NextResponse } from "next/server";
import {
  signInPath,
  signUpPath,
  ticketsByOrganisationPath,
  ticketsPath,
} from "@/path";
import type { Maybe } from "./types";

const TICKET_EDIT_RE = /^\/tickets\/[^/]+\/edit$/;

/** RFC 4648 Base64 (standard alphabet + / and = padding). */
const BASE64_RE =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
/** RFC 4648 Base64url (alphabet - _; optional padding). */
const BASE64URL_RE =
  /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}==|[A-Za-z0-9_-]{3}=)?$/;

/**
 * Better Auth session_token: plain base64url or token.signature (first part
 * base64url, rest standard Base64). RFC 4648 shape check only; real auth is page-level.
 */
const isValidSessionTokenShape = (token: Maybe<string>): boolean => {
  if (!token) {
    return false;
  }
  if (token.length < 32) {
    return false;
  }
  const parts = token.split(".");
  if (parts.length === 1) {
    return BASE64URL_RE.test(parts[0]);
  }
  if (parts.length === 2) {
    return BASE64URL_RE.test(parts[0]) && BASE64_RE.test(parts[1]);
  }

  if (!BASE64URL_RE.test(parts[0])) {
    return false;
  }
  if (!BASE64_RE.test(parts[1])) {
    return false;
  }
  for (let i = 2; i < parts.length; i++) {
    if (!BASE64_RE.test(parts[i])) {
      return false;
    }
  }
  return true;
};

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
  const token = request.cookies.get(
    // biome-ignore lint/style/noNonNullAssertion: will be verified in lib/env.ts
    process.env.NEXT_PUBLIC_SESSION_TOKEN_COOKIE_NAME!,
  )?.value;

  const hasSession = isValidSessionTokenShape(token);

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
