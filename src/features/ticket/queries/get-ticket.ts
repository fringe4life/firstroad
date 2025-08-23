"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/auth";
import { isOwner } from "@/features/auth/utils/owner";
import { PaginationMetadata } from "@/features/types/pagination";
import { getCommentCount } from "@/features/comment/queries/get-comment-count";

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
        take: 3,
      },
    },
  });

  if (!ticket) {
    return null;
  }

  // Get total comment count for pagination
  const totalComments = await getCommentCount(id);

  // Add isOwner property to each comment
  const commentsWithOwnership = ticket.comments.map(comment => ({
    ...comment,
    isOwner: isOwner(session, comment),
  }));

  return {
    ...ticket,
    comments: commentsWithOwnership,
    isOwner: isOwner(session, ticket),
    commentMetadata: {
      count: totalComments,
      hasNextPage: totalComments > 3,
    } as PaginationMetadata,
  };
};

export const getMoreComments = async (ticketId: string, skip: number, take: number = 3) => {
  const session = await auth();
  
  const comments = await prisma.comment.findMany({
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
    },
    skip,
    take,
  });

  const totalComments = await getCommentCount(ticketId);

  // Add isOwner property to each comment
  const commentsWithOwnership = comments.map(comment => ({
    ...comment,
    isOwner: isOwner(session, comment),
  }));

  return {
    comments: commentsWithOwnership,
    hasMore: skip + take < totalComments,
  };
};
