"use cache";

import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { commentsCache } from "@/utils/cache-tags";

// biome-ignore lint/suspicious/useAwait: needs to be for "use cache"
const getCommentsList = async ({
  ticketId,
  cursor,
  take,
}: {
  ticketId: string;
  cursor?: string;
  take: number;
}) => {
  cacheTag(commentsCache());
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
    orderBy: [{ id: "desc" }, { createdAt: "desc" }],
    take: take + 1, // Take one extra to check if there are more
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    skip: cursor ? 1 : undefined, // Skip the cursor record itself
  });
};

export { getCommentsList };
