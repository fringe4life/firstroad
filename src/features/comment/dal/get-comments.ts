"use server";

import { paginateItems } from "@/features/pagination/dal/paginate-items";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { getCommentsCount } from "../queries/get-comments-count";
import { getCommentsList } from "../queries/get-comments-list";
import type { CommentWithUserInfo } from "../types";

export const getCommentsByTicketId = async (
  ticketId: string,
  cursor?: string,
  take = 3,
): Promise<PaginatedResult<CommentWithUserInfo>> => {
  // Only cache the database query
  const { items, totalRows } = await paginateItems({
    getItems: () => getCommentsList({ ticketId, cursor, take }),
    getTotalRows: () => getCommentsCount({ ticketId }),
  });

  return transformToPaginatedResult(
    { items, totalRows },
    { cursor, limit: take, type: "cursor" },
  );
};
