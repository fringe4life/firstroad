"use server";

import type { SearchParams } from "nuqs/server";
import { paginateItems } from "@/features/pagination/dal/paginate-items";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { searchParamsCache } from "@/features/ticket/search-params";
import type { BaseTicket } from "@/features/ticket/types";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import { getTicketList } from "../queries/get-ticket-list";
import { getTicketsCount } from "../queries/get-tickets-count";

export const getAllTickets = async (
  searchParams: Promise<SearchParams>,
  filterUserId?: string,
): Promise<PaginatedResult<BaseTicket>> => {
  // Parse search params (not cached - fast and user-specific)
  const resolvedSearchParams = await searchParams;
  const { search, sortKey, sortValue, page, limit, scope } =
    searchParamsCache.parse(resolvedSearchParams);

  // Build orderBy based on sort parameter
  let orderBy: TicketOrderByWithRelationInput = {
    createdAt: sortValue,
  }; // default

  if (sortKey === "bounty") {
    orderBy = { bounty: sortValue };
  }

  // Server-side validation: if scope is 'mine' but no user, default to 'all'
  const effectiveScope = scope === "mine" && !filterUserId ? "all" : scope;

  const where: TicketWhereInput = {
    // Only filter by userId if scope is 'mine' and user is authenticated
    ...(effectiveScope === "mine" && filterUserId && { userId: filterUserId }),
    title: {
      contains: search,
      mode: "insensitive",
    },
  };

  const skip = page * limit;
  const takeAmount = limit;

  // Only cache the database transaction
  const { items, totalRows } = await paginateItems({
    getItems: () => getTicketList({ where, orderBy, takeAmount, skip }),
    getTotalRows: () => getTicketsCount({ where, orderBy }),
  });

  return transformToPaginatedResult(
    { items, totalRows },
    { page, limit, type: "offset" },
  );
};
