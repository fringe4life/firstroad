import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";

const getTicketList = ({
  where,
  orderBy,
  takeAmount,
  skip,
}: {
  where: TicketWhereInput;
  orderBy: TicketOrderByWithRelationInput;
  takeAmount: number;
  skip: number;
}) =>
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
  });

export { getTicketList };
