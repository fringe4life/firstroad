import type {
  RawPaginatedResult,
  RawPaginationAccess,
} from "@/features/pagination/types";
import { tryCatch } from "@/utils/try-catch";

const paginateItems = async <T>({
  getItems,
  getItemsCount,
}: RawPaginationAccess<T>): Promise<RawPaginatedResult<T>> => {
  const [{ data: items }, { data: itemsCount }] = await Promise.all([
    tryCatch(() => getItems()),
    tryCatch(() => getItemsCount()),
  ]);

  return { items, itemsCount };
};
export { paginateItems };
