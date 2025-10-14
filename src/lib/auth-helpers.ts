"use server";

import { getSession } from "@/features/auth/queries/get-session";
import type { MaybeServerSession } from "@/features/auth/types";

/**
 * Injects session data into a callback function
 * Does NOT require authentication - proceeds with null session if not authenticated
 *
 * @example
 * const ticket = await hasAuth((session) => getTicketById(session, ticketId));
 */
export async function hasAuth<TReturn>(
  fn: (session: MaybeServerSession) => Promise<TReturn>,
): Promise<TReturn> {
  const session = await getSession();
  return fn(session);
}

/**
 * Injects session data into a callback function
 * REQUIRES authentication - throws error if not authenticated
 *
 * @example
 * const ticket = await requireAuth((session) => getTicketById(session, ticketId));
 */
export async function requireAuth<TReturn>(
  fn: (session: MaybeServerSession) => Promise<TReturn>,
): Promise<TReturn> {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return fn(session);
}
