import { NO_PAGINATION } from "@/features/pagination/constants";
import type {
  PaginatedResult,
  PaginationType,
  RawPaginationResult,
} from "@/features/pagination/types";
import type { Id, Maybe } from "@/types";

const transformToPaginatedResult = <T extends Id>(
  { items, itemsCount }: RawPaginationResult<T>,
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
  if (pagination.type === "cursor") {
    const list = items;
    const totalCount = itemsCount ?? 0;
    const hasNextPage = list ? list.length > pagination.limit : false;
    const nextCursor: Maybe<string> = hasNextPage
      ? (list?.at(-1)?.id ?? null)
      : null;

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
