import type { PaginationType } from "@/features/pagination/pagination-search-params";
import type {
  DatabaseQueryResult,
  PaginatedResult,
} from "@/features/pagination/types";

export const transformToPaginatedResult = <T>(
  { items, totalRows }: DatabaseQueryResult<T>,
  pagination: PaginationType,
): PaginatedResult<T> => {
  const list = items;
  const totalCount = totalRows ?? 0;
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
};
