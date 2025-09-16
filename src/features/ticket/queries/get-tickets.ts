import type { SearchParams } from "nuqs/server";
import { getSession } from "@/features/auth/queries/get-session";
import { isOwner } from "@/features/auth/utils/owner";
import { searchParamsCache } from "@/features/ticket/search-params";
import type { BaseTicket } from "@/features/ticket/types";
import type { PaginatedResult } from "@/features/types/pagination";
import type { Prisma } from "@/generated/prisma/client";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import { prisma } from "@/lib/prisma";

export const getTickets = async (
  searchParams: Promise<SearchParams>,
  userId?: string,
): Promise<PaginatedResult<BaseTicket>> => {
  const { search, sortKey, sortValue, page, limit } =
    await searchParamsCache.parse(searchParams);
  const session = await getSession();

  // Build orderBy based on sort parameter
  let orderBy: TicketOrderByWithRelationInput = {
    createdAt: sortValue as Prisma.SortOrder,
  }; // default

  if (sortKey === "bounty") {
    orderBy = { bounty: sortValue as Prisma.SortOrder };
  }

  const where: TicketWhereInput = {
    userId,
    title: {
      contains: search,
      mode: "insensitive",
    },
  };

  const skip = page * limit;
  const take = limit;

  const [tickets, count] = await prisma.$transaction([
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
      take,
      skip,
    }),
    prisma.ticket.count({ where, orderBy }),
  ]);

  const ticketsWithOwnership = tickets.map((ticket) => ({
    ...ticket,
    isOwner: isOwner(session, ticket),
  }));

  return {
    list: ticketsWithOwnership,
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};
