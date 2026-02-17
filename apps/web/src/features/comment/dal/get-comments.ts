"use server";

import { cacheTag } from "next/cache";
import type { CommentWithAccess } from "@/features/auth/dto/add-comments-access";
import { addCommentsAccess } from "@/features/auth/dto/add-comments-access";
import type { User } from "@/features/auth/types";
import { paginateItems } from "@/features/pagination/dal/paginate-items";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { commentsCache, commentsForTicketCache } from "@/utils/cache-tags";
import { getCommentsCount } from "../queries/get-comments-count";
import { getCommentsList } from "../queries/get-comments-list";
import type { CommentWithUserInfo } from "../types";

export const getCommentsByTicketSlugWithPermissions = async (
  ticketSlug: string,
  organizationId: string,
  user: User,
  cursor?: string,
  take = 3,
): Promise<PaginatedResult<CommentWithAccess>> => {
  const result = await getCommentsByTicketSlug(ticketSlug, cursor, take);
  const list = result?.list;
  if (!list) {
    return { ...result, list: [] } as PaginatedResult<CommentWithAccess>;
  }
  const listWithAccess = await addCommentsAccess(list, user, organizationId);
  return {
    ...result,
    list: listWithAccess ?? [],
  };
};

/**
 * Unified load-more server action for Comments. Pass organizationId and userId
 * when user is authenticated to include permissions; omit for unauthenticated.
 */
export const getCommentsLoadMore = async (
  ticketSlug: string,
  cursor?: string,
  take?: number,
  organizationId?: string,
  userId?: string,
): Promise<PaginatedResult<CommentWithAccess | CommentWithUserInfo>> => {
  if (organizationId && userId) {
    return await getCommentsByTicketSlugWithPermissions(
      ticketSlug,
      organizationId,
      { id: userId } as User,
      cursor,
      take ?? 3,
    );
  }
  return await getCommentsByTicketSlug(ticketSlug, cursor, take ?? 3);
};

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
