import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type {
  ResourcePermission,
  ResourceType,
} from "@/features/memberships/types";
import type { List, Maybe } from "@/types";
import type { BaseTicket, TicketWithAccess } from "../types";

/**
 * Options for addTicketsAccess when ownership/permissions are pre-computed
 */
interface AddTicketsAccessOptions {
  /** When true, all tickets are owned by the user (skip isOwner checks) */
  allOwned?: boolean;
  /** Pre-fetched permissions map to avoid additional query */
  permissionsMap?: Map<string, ResourcePermission>;
}

/**
 * Add ownership and permission access to a list of tickets
 * Uses batch query for permissions to avoid N+1 queries
 *
 * @param tickets - List of tickets
 * @param user - Current user (or null if not authenticated)
 * @param options - Optional pre-computed ownership/permissions for parallel fetch optimization
 * @returns List of tickets with isOwner, canUpdate, and canDelete properties
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
      canCreate: false,
      canUpdate: false,
      canDelete: false,
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
    permissionsMap = await getMemberPermissionsBatch(
      user.id,
      organizationIds,
      "TICKET" satisfies ResourceType,
    );
  }

  // Map tickets with access info
  return tickets.map((ticket) => {
    // When allOwned is true, skip isOwner check (all tickets belong to user)
    const ticketIsOwner = options?.allOwned || isOwner(user, ticket);
    const permission = permissionsMap?.get(ticket.organizationId);

    return {
      ...ticket,
      isOwner: ticketIsOwner,
      canCreate: false,
      canUpdate: ticketIsOwner && (permission?.canUpdate ?? false),
      canDelete: ticketIsOwner && (permission?.canDelete ?? false),
    };
  });
};

export { addTicketsAccess };
export type { AddTicketsAccessOptions };
