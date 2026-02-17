import { prisma } from "@firstroad/db";
import { COMMENT_WITH_USER_INCLUDE } from "@/features/comment/constants";

// biome-ignore lint/suspicious/useAwait: needs to be for "use cache"
const getCommentsList = async ({
  ticketSlug,
  cursor,
  take,
}: {
  ticketSlug: string;
  cursor?: string;
  take: number;
}) => {
  return prisma.comment.findMany({
    where: {
      ticket: { slug: ticketSlug },
    },
    include: COMMENT_WITH_USER_INCLUDE,
    orderBy: [{ id: "desc" }, { updatedAt: "desc" }, { createdAt: "desc" }],
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
