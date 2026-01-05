"use server";

import type { SearchParams } from "nuqs/server";
import { paginateItems } from "@/features/pagination/dal/paginate-items";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { getTicketList } from "@/features/ticket/queries/get-ticket-list";
import { getTicketsCount } from "@/features/ticket/queries/get-tickets-count";
import { searchParamsCache } from "@/features/ticket/search-params";
import type { BaseTicket } from "@/features/ticket/types";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import type { Maybe } from "@/types";

export const getTickets = async (
  searchParams: Promise<SearchParams>,
  filterUserId?: Exclude<Maybe<string>, null>,
): Promise<PaginatedResult<BaseTicket>> => {
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
    userId: filterUserId,
  };

  const skip = page * limit;
  const takeAmount = limit;

  // data access layer
  const result = await paginateItems({
    getItems: () => getTicketList({ where, orderBy, takeAmount, skip }),
    getItemsCount: () => getTicketsCount({ where, orderBy }),
  });

  // data transfer object
  return transformToPaginatedResult(result, { page, limit, type: "offset" });
};
