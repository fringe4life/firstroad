import type { UserProp } from "./types";

const DEFAULT_NO_USER = { user: null, hasUser: false } satisfies UserProp;

const SESSION_TOKEN_COOKIE_NAME = "better-auth.session_token";

const PRODUCTION_SESSION_TOKEN_COOKIE_NAME =
  "__Secure-better-auth.session_token";

export {
  DEFAULT_NO_USER,
  PRODUCTION_SESSION_TOKEN_COOKIE_NAME,
  SESSION_TOKEN_COOKIE_NAME,
};
