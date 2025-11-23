"use server";

import { cacheTag } from "next/cache";
import type { SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/features/ticket/search-params";
import type { BaseTicket } from "@/features/ticket/types";
import type { PaginatedResult } from "@/features/types/pagination";
import type { Prisma } from "@/generated/prisma/client";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import { prisma } from "@/lib/prisma";

// Cached database query - only the expensive part
const getTicketsFromDB = async (
  where: TicketWhereInput,
  orderBy: TicketOrderByWithRelationInput,
  takeAmount: number,
  skip: number,
) => {
  "use cache";
  cacheTag("tickets");

  return await prisma.$transaction([
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
    prisma.ticket.count({ where, orderBy }),
  ]);
};

export const getAllTickets = async (
  searchParams?: Promise<SearchParams>,
  filterUserId?: string,
): Promise<PaginatedResult<BaseTicket>> => {
  // Parse search params (not cached - fast and user-specific)
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : {};
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
  const [tickets, count] = await getTicketsFromDB(
    where,
    orderBy,
    takeAmount,
    skip,
  );

  return {
    list: tickets.slice(0, -2),
    metadata: {
      count,
      hasNextPage: count > skip + takeAmount,
      nextCursor: tickets[takeAmount]?.id ?? null,
    },
  };
};
