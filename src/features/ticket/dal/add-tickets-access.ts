import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type { MemberPermission } from "@/features/memberships/types";
import type { List, Maybe } from "@/types";
import type { BaseTicket, TicketWithAccess } from "../types";

/**
 * Options for addTicketsAccess when ownership/permissions are pre-computed
 */
interface AddTicketsAccessOptions {
  /** When true, all tickets are owned by the user (skip isOwner checks) */
  allOwned?: boolean;
  /** Pre-fetched permissions map to avoid additional query */
  permissionsMap?: Map<string, MemberPermission>;
}

/**
 * Add ownership and permission access to a list of tickets
 * Uses batch query for permissions to avoid N+1 queries
 *
 * @param tickets - List of tickets
 * @param user - Current user (or null if not authenticated)
 * @param options - Optional pre-computed ownership/permissions for parallel fetch optimization
 * @returns List of tickets with isOwner and canDeleteTicket properties
 */
const addTicketsAccess = async (
  tickets: List<BaseTicket>,
  user: Maybe<User>,
  options?: AddTicketsAccessOptions,
): Promise<List<TicketWithAccess>> => {
  if (!tickets) {
    return null;
  }
  if (tickets.length === 0) {
    return [];
  }

  // If no user, no one owns anything and no one can delete/update
  if (!user) {
    return tickets.map((ticket) => ({
      ...ticket,
      isOwner: false,
      canDeleteTicket: false,
      canUpdateTicket: false,
    }));
  }

  // Use pre-fetched permissionsMap if provided (parallel fetch optimization)
  let permissionsMap = options?.permissionsMap;

  if (!permissionsMap) {
    // Get unique organization IDs from tickets the user owns
    const ownedTickets = options?.allOwned
      ? tickets
      : tickets.filter((ticket) => isOwner(user, ticket));
    const organizationIds = [
      ...new Set(ownedTickets.map((t) => t.organizationId)),
    ];

    // Batch fetch permissions for all relevant organizations
    permissionsMap = await getMemberPermissionsBatch(user.id, organizationIds);
  }

  // Map tickets with access info
  return tickets.map((ticket) => {
    // When allOwned is true, skip isOwner check (all tickets belong to user)
    const ticketIsOwner = options?.allOwned || isOwner(user, ticket);
    const permission = permissionsMap.get(ticket.organizationId);

    return {
      ...ticket,
      isOwner: ticketIsOwner,
      canDeleteTicket: ticketIsOwner && (permission?.canDeleteTicket ?? false),
      canUpdateTicket: ticketIsOwner && (permission?.canUpdateTicket ?? false),
    };
  });
};

export { addTicketsAccess };
export type { AddTicketsAccessOptions };
