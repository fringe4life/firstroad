"use server";

import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";
import type { Comment } from "@/features/comment/types";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";

export type LoadMoreState = {
  list: Maybe<Comment[]>;
  hasMore: boolean;
  nextCursor: Maybe<string>;
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
