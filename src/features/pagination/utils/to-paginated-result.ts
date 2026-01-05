import { NO_PAGINATION } from "@/features/pagination/constants";
import type {
  PaginatedResult,
  PaginationType,
  RawPaginatedResult,
} from "@/features/pagination/types";
import type { Id } from "@/types";

/**
 * @abstract transformation function to convert raw pagination result to paginated result
 * @param RawPaginationResult { items, itemsCount }
 * @param PaginationType { type, page, limit }
 * @returns PaginatedResult { list, metadata }
 */
const transformToPaginatedResult = <T extends Id>(
  { items, itemsCount }: RawPaginatedResult<T>,
  pagination: PaginationType,
): PaginatedResult<T> => {
  if (pagination.type === "offset") {
    const list = items;
    const totalCount = itemsCount ?? 0;
    const hasNextPage = (pagination.page + 1) * pagination.limit < totalCount;
    const nextCursor = hasNextPage ? String(pagination.page + 1) : null;

    return {
      list,
      metadata: {
        count: totalCount,
        hasNextPage,
        nextCursor,
      },
    };
  }
  // TODO: fix this to also determine hasPreviousPage, to reverse items if needed etc
  if (pagination.type === "cursor") {
    const list = items;
    const totalCount = itemsCount ?? 0;
    const hasNextPage = list ? list.length > pagination.limit : false;
    const nextCursor = hasNextPage ? (list?.at(-1)?.id ?? null) : null;

    return {
      list,
      metadata: {
        count: totalCount,
        hasNextPage,
        nextCursor,
      },
    };
  }
  return NO_PAGINATION;
};

export { transformToPaginatedResult };
