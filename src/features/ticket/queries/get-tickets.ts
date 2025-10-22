"use server";

import { cacheTag } from "next/cache";
import type { SearchParams } from "nuqs/server";
import type { MaybeServerSession } from "@/features/auth/types";
import { withOwnership } from "@/features/auth/utils/owner";
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
      take: takeAmount,
      skip,
    }),
    prisma.ticket.count({ where, orderBy }),
  ]);
};

export const getAllTickets = async (
  session: MaybeServerSession,
  searchParams: Promise<SearchParams>,
  filterUserId?: string,
): Promise<PaginatedResult<BaseTicket>> => {
  // Parse search params (not cached - fast and user-specific)
  const resolvedSearchParams = await searchParams;
  const { search, sortKey, sortValue, page, limit } =
    searchParamsCache.parse(resolvedSearchParams);

  // Build orderBy based on sort parameter
  let orderBy: TicketOrderByWithRelationInput = {
    createdAt: sortValue as Prisma.SortOrder,
  }; // default

  if (sortKey === "bounty") {
    orderBy = { bounty: sortValue as Prisma.SortOrder };
  }

  const where: TicketWhereInput = {
    userId: filterUserId,
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

  // Apply ownership logic (not cached - user-specific)
  const ticketsWithOwnership = withOwnership(session, tickets);

  return {
    list: ticketsWithOwnership,
    metadata: {
      count,
      hasNextPage: count > skip + takeAmount,
    },
  };
};
