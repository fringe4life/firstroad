"use server";

import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";
import type { Comment } from "@/features/comment/types";
import { tryCatch } from "@/utils/try-catch";

export type LoadMoreState = {
  list: Comment[];
  hasMore: boolean;
  nextCursor: string | null;
  error?: string;
};

export const loadMoreComments = async (
  ticketId: string,
  cursor: string,
): Promise<LoadMoreState> => {
  const { data } = await tryCatch(
    async () => await getCommentsByTicketId(ticketId, cursor),
  );

  if (data) {
    return data;
  }

  return {
    list: [],
    hasMore: false,
    nextCursor: null,
  };
};
