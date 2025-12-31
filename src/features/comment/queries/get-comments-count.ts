import { prisma } from "@/lib/prisma";

const getCommentsCount = ({ ticketId }: { ticketId: string }) =>
  prisma.comment.count({ where: { ticketId } });

export { getCommentsCount };
