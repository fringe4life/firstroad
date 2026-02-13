"use server";

import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@firstroad/db/client-types";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { getUser } from "@/features/auth/queries/get-user";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import { getUserOrgIds } from "@/features/memberships/queries/get-user-org-ids";
import { paginateItems } from "@/features/pagination/dal/paginate-items";
import { searchParamsCache } from "@/features/pagination/pagination-search-params";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { addTicketsAccess } from "@/features/ticket/dal/add-tickets-access";
import { getTicketList } from "@/features/ticket/queries/get-ticket-list";
import { getTicketsCount } from "@/features/ticket/queries/get-tickets-count";
import type { TicketWithAccess } from "@/features/ticket/types";
import { onboardingPath, signInPath } from "@/path";
import type { Maybe } from "@/types";

export const getTickets = async (
  searchParams: Promise<SearchParams>,
  filterUserId?: Exclude<Maybe<string>, null>,
  byOrganisation = false,
): Promise<PaginatedResult<TicketWithAccess>> => {
  await connection();
  const { user } = await getUser();

  const organizationId = byOrganisation
    ? user?.activeOrganizationId
    : undefined;

  if (byOrganisation && !user) {
    throw redirect(signInPath());
  }

  if (byOrganisation && !organizationId) {
    throw redirect(onboardingPath());
  }
  // Parse search params (not cached - fast and user-specific)
  const resolvedSearchParams = await searchParams;
  const { search, sortKey, sortValue, page, limit } =
    searchParamsCache.parse(resolvedSearchParams);

  // Build orderBy based on sort parameter
  let orderBy: TicketOrderByWithRelationInput = {
    createdAt: sortValue,
  };

  if (sortKey === "bounty") {
    orderBy = { bounty: sortValue };
  }

  const where: TicketWhereInput = {
    title: {
      contains: search,
      mode: "insensitive",
    },
    userId: byOrganisation ? undefined : filterUserId,
    // biome-ignore lint/style/noNonNullAssertion: have checked
    organizationId: byOrganisation ? organizationId! : undefined,
  };

  const skip = page * limit;
  const takeAmount = limit;

  // Detect if user is viewing their own tickets (all results will be owned)
  const isOwnTickets = filterUserId && user && filterUserId === user.id;

  if (isOwnTickets) {
    // Parallel fetch: tickets + user's organization IDs
    const [result, orgIds] = await Promise.all([
      paginateItems({
        getItems: () => getTicketList({ where, orderBy, takeAmount, skip }),
        getItemsCount: () => getTicketsCount({ where, orderBy }),
      }),
      getUserOrgIds(user.id),
    ]);

    // Fetch permissions for all user's organizations
    const permissionsMap = await getMemberPermissionsBatch(
      user.id,
      orgIds,
      "TICKET",
    );

    // All tickets are owned, pass pre-fetched permissions
    const ticketsWithAccess = await addTicketsAccess(result.items, user, {
      allOwned: true,
      permissionsMap,
    });

    return transformToPaginatedResult(
      { items: ticketsWithAccess, itemsCount: result.itemsCount },
      { page, limit, type: "offset" },
    );
  }

  // Default path: byOrganisation or browsing (smart waterfall)
  const result = await paginateItems({
    getItems: () => getTicketList({ where, orderBy, takeAmount, skip }),
    getItemsCount: () => getTicketsCount({ where, orderBy }),
  });

  // Add ownership and permission access (batch query with smart filtering)
  const ticketsWithAccess = await addTicketsAccess(result.items, user);

  return transformToPaginatedResult(
    { items: ticketsWithAccess, itemsCount: result.itemsCount },
    { page, limit, type: "offset" },
  );
};
