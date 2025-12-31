import { tryCatch } from "@/utils/try-catch";
import type { RawPaginationAccess, RawPaginationResult } from "../types";

const paginateItems = async <T>({
  getItems,
  getTotalRows,
}: RawPaginationAccess<T>): Promise<RawPaginationResult<T>> => {
  const [{ data: items }, { data: totalRows }] = await Promise.all([
    tryCatch(() => getItems()),
    tryCatch(() => getTotalRows()),
  ]);

  return { items, totalRows };
};
export { paginateItems };
