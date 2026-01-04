import { cacheTag } from "next/cache";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { ticketsCache } from "@/utils/cache-tags";

// biome-ignore lint/suspicious/useAwait: needed for use cache
const getTicketList = async ({
  where,
  orderBy,
  takeAmount,
  skip,
}: {
  where: TicketWhereInput;
  orderBy: TicketOrderByWithRelationInput;
  takeAmount: number;
  skip: number;
}) => {
  "use cache";
  cacheTag(ticketsCache());
  return prisma.ticket.findMany({
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
  });
};

export { getTicketList };
