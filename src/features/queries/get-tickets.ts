import { prisma } from "@/lib/prisma";
import type { SearchParams } from "../ticket/search-params";

export const getTickets = async (
  userId?: string, 
  searchParams?: Awaited<SearchParams["searchParams"]>
) => {
  const { search, sort } = searchParams || {};
  
  // Build orderBy based on sort parameter
  let orderBy: any = { createdAt: "desc" }; // default
  
  if (sort === "bounty") {
    orderBy = { bounty: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

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
    orderBy,
  });
};
