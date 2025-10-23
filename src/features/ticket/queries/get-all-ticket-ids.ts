import { prisma } from "@/lib/prisma";

export const getAllTicketIds = async () => {
  const tickets = await prisma.ticket.findMany({
    select: { id: true },
  });

  return tickets.map((ticket) => ({
    id: ticket.id,
  }));
};
