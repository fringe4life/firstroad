import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// Cached database query - only the expensive part
const getTicketFromDBBySlug = async (slug: string) => {
  "use cache";
  cacheTag("tickets");
  cacheTag(`ticket-slug-${slug}`);

  return await prisma.ticket.findUnique({
    where: { slug },
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

// Cached database query - only the expensive part
const getTicketFromDBById = async (ticketId: string) => {
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

export const getTicketBySlug = async (slug: string) => {
  // Only cache the database query
  const ticket = await getTicketFromDBBySlug(slug);

  if (!ticket) {
    return null;
  }

  return ticket;
};

export const getTicketById = async (ticketId: string) => {
  // Only cache the database query
  const ticket = await getTicketFromDBById(ticketId);

  if (!ticket) {
    return null;
  }

  return ticket;
};
