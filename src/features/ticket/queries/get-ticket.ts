import { prisma } from "@/lib/prisma";
import { auth } from "@/app/auth";
import { isOwner } from "@/features/auth/utils/owner";

export const getTicket = async (id: string) => {
  const session = await auth();
  
  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
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
      comments: {
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
      },
    },
  });

  if (!ticket) {
    return null;
  }

  return {
    ...ticket,
    isOwner: isOwner(session, ticket),
  };
};
