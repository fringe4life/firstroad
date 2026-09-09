import type { IsOwner, UserProp } from "./types";

const DEFAULT_NO_USER = { hasUser: false, user: null } satisfies UserProp;

const DEFAULT_OWNERSHIP = { isOwner: false } satisfies IsOwner;

export { DEFAULT_NO_USER, DEFAULT_OWNERSHIP };
