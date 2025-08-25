"use server"

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/auth";
import { isOwner } from "@/features/auth/utils/owner";
import { PaginationMetadata } from "@/features/types/pagination";

export const getTicket = cache(async (id: string) => {
  const session = await auth();
  
  const ticket = await prisma.ticket.findUnique({
    where: { id },
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
          id: "desc", // Use id for cursor-based pagination
        },
        take: 4, // Take one extra to check if there are more
      },
    },
  });

  if (!ticket) {
    return null;
  }

  // Check if there are more comments using cursor-based logic
  const hasMore = ticket.comments.length > 3;
  const commentsToReturn = hasMore ? ticket.comments.slice(0, 3) : ticket.comments;

  // Add isOwner property to each comment
  const commentsWithOwnership = commentsToReturn.map(comment => ({
    ...comment,
    isOwner: isOwner(session, comment),
  }));

  return {
    ...ticket,
    list: commentsWithOwnership,
    isOwner: isOwner(session, ticket),
    metadata: {
      count: commentsToReturn.length, // This is just the count of loaded comments
      hasNextPage: hasMore,
    } satisfies PaginationMetadata,
  };
});

export const getMoreComments = cache(async (ticketId: string, cursor?: string, take: number = 3) => {
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
      id: "desc", // Use id for cursor-based pagination
      createdAt: "desc",
    },
    take: take + 1, // Take one extra to check if there are more
    cursor: cursor ? {
      id: cursor,
    } : undefined,
    skip: cursor ? 1 : undefined, // Skip the cursor record itself
  });

  // Check if there are more comments
  const hasMore = comments.length > take;
  const commentsToReturn = hasMore ? comments.slice(0, take) : comments;

  // Add isOwner property to each comment
  const commentsWithOwnership = commentsToReturn.map(comment => ({
    ...comment,
    isOwner: isOwner(session, comment),
  }));

  return {
    list: commentsWithOwnership,
    hasMore,
    nextCursor: hasMore ? commentsToReturn.at(-1)?.id : null,
  };
});
