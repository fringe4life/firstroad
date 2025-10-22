"use server";

import { cacheTag } from "next/cache";
import type { MaybeServerSession } from "@/features/auth/types";
import { isOwner, withOwnership } from "@/features/auth/utils/owner";
import type { PaginationMetadata } from "@/features/types/pagination";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Cached database query - only the expensive part
const getTicketFromDB = async (ticketId: string) => {
  "use cache";
  cacheTag("tickets");
  cacheTag(`ticket-${ticketId}`);
  cacheTag(`comments-${ticketId}`);

  return await prisma.ticket.findUnique({
    where: { id: ticketId },
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
          id: "desc" as Prisma.SortOrder,
        },
        take: 4, // Take one extra to check if there are more
      },
    },
  });
};

export const getTicketById = async (
  session: MaybeServerSession,
  ticketId: string,
) => {
  // Only cache the database query
  const ticket = await getTicketFromDB(ticketId);

  if (!ticket) {
    return null;
  }

  // Check if there are more comments using cursor-based logic (not cached)
  const MAX_COMMENTS_PREVIEW = 3;
  const hasMore = ticket.comments.length > MAX_COMMENTS_PREVIEW;
  const commentsToReturn = hasMore
    ? ticket.comments.slice(0, MAX_COMMENTS_PREVIEW)
    : ticket.comments;

  // Add isOwner property to each comment (not cached - user-specific)
  const commentsWithOwnership = withOwnership(session, commentsToReturn);

  return {
    ...ticket,
    list: commentsWithOwnership,
    isOwner: isOwner(session, ticket), // Not cached - user-specific
    metadata: {
      count: commentsToReturn.length,
      hasNextPage: hasMore,
    } satisfies PaginationMetadata,
  };
};

// Cached database query - only the expensive part
const getCommentsFromDB = async (
  ticketId: string,
  cursor?: string,
  take = 3,
) => {
  "use cache";
  cacheTag("tickets");
  cacheTag(`ticket-${ticketId}`);
  cacheTag(`comments-${ticketId}`);

  return await prisma.comment.findMany({
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
      id: "desc" as Prisma.SortOrder,
      createdAt: "desc" as Prisma.SortOrder,
    },
    take: take + 1, // Take one extra to check if there are more
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    skip: cursor ? 1 : undefined, // Skip the cursor record itself
  });
};

export const getCommentsByTicketId = async (
  session: MaybeServerSession,
  ticketId: string,
  cursor?: string,
  take = 3,
) => {
  // Only cache the database query
  const comments = await getCommentsFromDB(ticketId, cursor, take);

  // Check if there are more comments (not cached)
  const hasMore = comments.length > take;
  const commentsToReturn = hasMore ? comments.slice(0, take) : comments;

  // Add isOwner property to each comment (not cached - user-specific)
  const commentsWithOwnership = withOwnership(session, commentsToReturn);

  return {
    list: commentsWithOwnership,
    hasMore,
    nextCursor: hasMore ? commentsToReturn.at(-1)?.id : null,
  };
};
