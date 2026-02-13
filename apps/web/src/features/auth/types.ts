import type { TicketModel } from "@firstroad/db/client-types";
import type { auth } from "@/lib/auth";
import type { authClient } from "@/lib/auth-client";
import type { ResourcePermission } from "../memberships/types";

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

interface NoUser {
  user: null | undefined;
  hasUser: false;
}

interface HasUser {
  user: User;
  hasUser: true;
}
export type UserProp = NoUser | HasUser;

export interface UserVerifiable extends Pick<TicketModel, "userId"> {}

export interface IsOwner {
  isOwner: boolean;
}

export interface EmailSearchParams {
  searchParams: Promise<{ email?: string }>;
}

export interface ItemsWithPermissionsOptions {
  permissionsMap?: Map<string, ResourcePermission>;
}
