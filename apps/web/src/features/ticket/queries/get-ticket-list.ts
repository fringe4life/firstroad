import { prisma } from "@firstroad/db";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@firstroad/db/client-types";
import { cacheTag } from "next/cache";
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
  "use cache: remote";
  cacheTag(ticketsCache());
  return prisma.ticket.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy,
    take: takeAmount,
    skip,
  });
};

export { getTicketList };
