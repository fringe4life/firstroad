import { prisma } from "@firstroad/db";

const getCommentsCount = ({ ticketSlug }: { ticketSlug: string }) =>
  prisma.comment.count({ where: { ticket: { slug: ticketSlug } } });

export { getCommentsCount };
