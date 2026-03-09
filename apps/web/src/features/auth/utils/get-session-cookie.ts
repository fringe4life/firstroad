import type { NextRequest } from "next/server";
import { EDGE_SESSION_COOKIE_NAME } from "@/lib/env-edge";
import type { Maybe } from "@/types";

/**
 * Parses the Cookie header string into a Map of name -> value.
 * Handles cookie values that may contain "=".
 */
const parseCookieHeader = (cookieHeader: string): Map<string, string> => {
  const cookies = cookieHeader.split("; ");
  const map = new Map<string, string>();
  for (const cookie of cookies) {
    const eqIndex = cookie.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    const name = cookie.slice(0, eqIndex).trim();
    const value = cookie.slice(eqIndex + 1).trim();
    map.set(name, value);
  }
  return map;
};

/**
 * Returns the session token cookie value if present.
 * Optimistic only: does not validate the token; used for middleware routing.
 * Cookie name is read from NEXT_PUBLIC_SESSION_TOKEN_COOKIE_NAME (e.g. better-auth.session_token or __Secure-better-auth.session_token).
 */
export const getSessionCookie = (
  request: NextRequest | Request | Headers,
): Maybe<string> => {
  const headers =
    request instanceof Headers || !("headers" in request)
      ? request
      : request.headers;
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const parsed = parseCookieHeader(cookieHeader);

  const value = parsed.get(EDGE_SESSION_COOKIE_NAME);
  const found = value && value.length > 0;

  if (found) {
    return value;
  }
  return null;
};
