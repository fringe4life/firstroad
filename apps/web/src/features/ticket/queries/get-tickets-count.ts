import { prisma } from "@firstroad/db";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@firstroad/db/client-types";

const getTicketsCount = ({
  where,
  orderBy,
}: {
  where: TicketWhereInput;
  orderBy: TicketOrderByWithRelationInput;
}) => prisma.ticket.count({ where, orderBy });

export { getTicketsCount };
