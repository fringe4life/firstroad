import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type { List, Maybe } from "@/types";
import type { BaseTicket, TicketWithAccess } from "../types";

/**
 * Add ownership and permission access to a list of tickets
 * Uses batch query for permissions to avoid N+1 queries
 *
 * @param tickets - List of tickets
 * @param user - Current user (or null if not authenticated)
 * @returns List of tickets with isOwner and canDeleteTicket properties
 */
const addTicketsAccess = async (
  tickets: List<BaseTicket>,
  user: Maybe<User>,
): Promise<List<TicketWithAccess>> => {
  if (!tickets) {
    return null;
  }
  if (tickets.length === 0) {
    return [];
  }

  // If no user, no one owns anything and no one can delete
  if (!user) {
    return tickets.map((ticket) => ({
      ...ticket,
      isOwner: false,
      canDeleteTicket: false,
    }));
  }

  // Get unique organization IDs from tickets the user owns
  const ownedTickets = tickets.filter((ticket) => isOwner(user, ticket));
  const organizationIds = [
    ...new Set(ownedTickets.map((t) => t.organizationId)),
  ];

  // Batch fetch permissions for all relevant organizations
  const permissionsMap = await getMemberPermissionsBatch(
    user.id,
    organizationIds,
  );

  // Map tickets with access info
  return tickets.map((ticket) => {
    const ticketIsOwner = isOwner(user, ticket);
    const permission = permissionsMap.get(ticket.organizationId);

    return {
      ...ticket,
      isOwner: ticketIsOwner,
      canDeleteTicket: ticketIsOwner && (permission?.canDeleteTicket ?? false),
    };
  });
};

export { addTicketsAccess };
