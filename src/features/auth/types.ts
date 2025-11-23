import type { auth } from "@/lib/auth";
import type { authClient } from "@/lib/auth-client";

// Server-side session type (from auth instance)
export type ServerSession = typeof auth.$Infer.Session;

// Client-side session type (from authClient instance)
export type ClientSession = typeof authClient.$Infer.Session;

// User type (extracted from session)
export type User = ServerSession["user"];

// Session type (extracted from session)
export type Session = ServerSession["session"];

// Optional server session type (commonly used in DAL functions)
export type MaybeServerSession = ServerSession | null;
