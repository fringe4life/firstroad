import { DEFAULT_OWNERSHIP } from "@/features/auth/constants";
import type { User } from "@/features/auth/types";
import { addItemPermissions } from "@/features/auth/utils/add-item-permissions";
import { isOwner } from "@/features/auth/utils/owner";
import { DEFAULT_ITEM_PERMISSION } from "@/features/memberships/constants";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type { ResourceType } from "@/features/memberships/types";
import type { List, Maybe } from "@/types";
import type {
  AddTicketsAccessOptions,
  BaseTicket,
  TicketWithAccess,
} from "../types";

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
      ...DEFAULT_OWNERSHIP,
      ...DEFAULT_ITEM_PERMISSION,
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

    return addItemPermissions(ticket, ticketIsOwner, permission);
  });
};

export { addTicketsAccess };
