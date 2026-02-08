import { prisma } from "@firstroad/db";

const getAllTicketSlugs = async () => {
  const tickets = await prisma.ticket.findMany({
    select: { slug: true },
  });

  return tickets.map((ticket) => ({
    slug: ticket.slug,
  }));
};

export { getAllTicketSlugs };
