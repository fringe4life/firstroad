"use server";

import { cacheTag } from "next/cache";
import type { SearchParams } from "nuqs/server";
import type { DatabaseQueryResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { searchParamsCache } from "@/features/ticket/search-params";
import type { BaseTicket } from "@/features/ticket/types";
import type { PaginatedResult } from "@/features/types/pagination";
import type { Prisma } from "@/generated/prisma/client";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/utils/try-catch";

// Cached database query - only the expensive part
const getTicketsFromDB = async (
  where: TicketWhereInput,
  orderBy: TicketOrderByWithRelationInput,
  takeAmount: number,
  skip: number,
): Promise<DatabaseQueryResult<BaseTicket>> => {
  "use cache";
  cacheTag("tickets");

  const [{ data: items }, { data: totalRows }] = await Promise.all([
    tryCatch(() =>
      prisma.ticket.findMany({
        where,
        include: {
          userInfo: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy,
        take: takeAmount + 1,
        skip,
      }),
    ),
    tryCatch(() => prisma.ticket.count({ where, orderBy })),
  ]);

  return { items, totalRows };
};

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
    createdAt: sortValue as Prisma.SortOrder,
  }; // default

  if (sortKey === "bounty") {
    orderBy = { bounty: sortValue as Prisma.SortOrder };
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
  const { items, totalRows } = await getTicketsFromDB(
    where,
    orderBy,
    takeAmount,
    skip,
  );

  return transformToPaginatedResult({ items, totalRows }, { page, limit });
};
