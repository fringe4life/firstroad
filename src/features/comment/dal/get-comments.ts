"use server";

import { cacheTag } from "next/cache";
import { paginateItems } from "@/features/pagination/dal/paginate-items";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { commentsCache, commentsForTicketCache } from "@/utils/cache-tags";
import { getCommentsCount } from "../queries/get-comments-count";
import { getCommentsList } from "../queries/get-comments-list";
import type { CommentWithUserInfo } from "../types";

export const getCommentsByTicketSlug = async (
  ticketSlug: string,
  cursor?: string,
  take = 3,
): Promise<PaginatedResult<CommentWithUserInfo>> => {
  "use cache";
  cacheTag(commentsCache());
  cacheTag(commentsForTicketCache(ticketSlug));
  // Only cache the database query
  const result = await paginateItems({
    getItems: () => getCommentsList({ ticketSlug, cursor, take }),
    getItemsCount: () => getCommentsCount({ ticketSlug }),
  });

  return transformToPaginatedResult(result, {
    cursor,
    limit: take,
    type: "cursor",
  });
};
