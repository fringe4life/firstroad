import type { TicketModel } from "@/generated/prisma/models";
import type { auth } from "@/lib/auth";
import type { authClient } from "@/lib/auth-client";

// Server-side session type (from auth instance)
export type ServerSession = typeof auth.$Infer.Session;

// Client-side session type (from authClient instance)
export type ClientSession = typeof authClient.$Infer.Session;

// Base user type (extracted from session)
type BaseUser = ServerSession["user"];

export interface ActiveOrganizationId
  extends Pick<ServerSession["session"], "activeOrganizationId"> {}

// Extended user type with activeOrganizationId appended
export type User = BaseUser & ActiveOrganizationId;

export type UserProp = NoUser | HasUser;

interface NoUser {
  user: null | undefined;
  hasUser: false;
}

interface HasUser {
  user: User;
  hasUser: true;
}

// Session type (extracted from session)
export type Session = ServerSession["session"];

export interface UserVerifiable extends Pick<TicketModel, "userId"> {}

export interface IsOwner {
  isOwner: boolean;
}
