"use server";

import { cacheTag } from "next/cache";
import { connection } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Cached database query for comments
const getCommentsFromDB = async (
  ticketId: string,
  cursor?: string,
  take = 3,
) => {
  "use cache";
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
    orderBy: [
      { id: "desc" as Prisma.SortOrder },
      { createdAt: "desc" as Prisma.SortOrder },
    ],
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
  ticketId: string,
  cursor?: string,
  take = 3,
) => {
  // Only cache the database query
  await connection();
  const comments = await getCommentsFromDB(ticketId, cursor, take);

  // Check if there are more comments (not cached)
  const hasMore = comments.length > take;
  const commentsToReturn = hasMore ? comments.slice(0, take) : comments;

  return {
    list: commentsToReturn,
    hasMore,
    nextCursor: hasMore ? (commentsToReturn.at(-1)?.id ?? null) : null,
  };
};
