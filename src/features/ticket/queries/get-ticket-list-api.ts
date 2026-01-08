import type { BaseTicket } from "@/features/ticket/types";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type { List } from "@/types";

const getTicketListApi = async ({
  where,
  orderBy,
  takeAmount,
  skip,
}: {
  where: TicketWhereInput;
  orderBy: TicketOrderByWithRelationInput;
  takeAmount: number;
  skip: number;
}): Promise<List<BaseTicket>> =>
  prisma.ticket.findMany({
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

export { getTicketListApi };
