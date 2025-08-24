import { prisma } from "@/lib/prisma";

export const getComments = async (ticketId: string) => {
  return prisma.comment.findMany({
    where: {
      ticketId,
    },
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
    orderBy: {
      createdAt: "desc",
      ticketId: "desc",
    },
  });
};