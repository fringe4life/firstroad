import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// Cached database query - only the expensive part
const getTicketFromDB = async (ticketId: string) => {
  "use cache";
  cacheTag("tickets");
  cacheTag(`ticket-${ticketId}`);

  return await prisma.ticket.findUnique({
    where: { id: ticketId },
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
  });
};

export const getTicketById = async (ticketId: string) => {
  // Only cache the database query
  const ticket = await getTicketFromDB(ticketId);

  if (!ticket) {
    return null;
  }

  return ticket;
};
