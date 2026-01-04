import { prisma } from "@/lib/prisma";

const getCommentsCount = ({ ticketSlug }: { ticketSlug: string }) =>
  prisma.comment.count({ where: { ticket: { slug: ticketSlug } } });

export { getCommentsCount };
