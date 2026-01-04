import type { TicketModel } from "@/generated/prisma/models";
import type { auth } from "@/lib/auth";
import type { authClient } from "@/lib/auth-client";
import type { Maybe } from "@/types";

// Server-side session type (from auth instance)
export type ServerSession = typeof auth.$Infer.Session;

// Client-side session type (from authClient instance)
export type ClientSession = typeof authClient.$Infer.Session;

// User type (extracted from session)
export type User = ServerSession["user"];

export interface UserProp {
  user: Maybe<User>;
  hasUser: boolean;
}

// Session type (extracted from session)
export type Session = ServerSession["session"];

export interface Entity extends Pick<TicketModel, "userId"> {}

export interface IsOwner {
  isOwner: boolean;
}
