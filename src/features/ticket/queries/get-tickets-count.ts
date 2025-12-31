import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";

const getTicketsCount = ({
  where,
  orderBy,
}: {
  where: TicketWhereInput;
  orderBy: TicketOrderByWithRelationInput;
}) => prisma.ticket.count({ where, orderBy });

export { getTicketsCount };
