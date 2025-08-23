import { prisma } from "@/lib/prisma";

export const getCommentCount = async (ticketId: string) => {
  return await prisma.comment.count({
    where: {
      ticketId,
    },
  });
};
