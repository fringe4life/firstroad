import { prisma } from "@/lib/prisma";
import type { SearchParams } from "../ticket/search-params";

export const getTickets = async (userId?: string, search?: Awaited<SearchParams["searchParams"]>["search"]) => {
  return await prisma.ticket.findMany({
    where: {
      userId: userId,
      title:  {
        contains: search,
        mode: "insensitive",
      },
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });
};
