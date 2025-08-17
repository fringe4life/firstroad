import { prisma } from "@/lib/prisma";

export const getTickets = async (userId?: string) => {
  return await prisma.ticket.findMany({
    where: userId ? {
      userId: userId,
    } : undefined,
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
    },
  });
};
