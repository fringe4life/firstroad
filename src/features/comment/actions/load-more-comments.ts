"use server";

import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";
import type { Comment } from "@/features/comment/types";

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
  try {
    const result = await getCommentsByTicketId(ticketId, cursor);
    return {
      list: result.list,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    };
  } catch {
    return {
      list: [],
      hasMore: false,
      nextCursor: null,
    };
  }
};
