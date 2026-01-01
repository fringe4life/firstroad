import type {
  RawPaginationAccess,
  RawPaginationResult,
} from "@/features/pagination/types";
import { tryCatch } from "@/utils/try-catch";

const paginateItems = async <T>({
  getItems,
  getItemsCount,
}: RawPaginationAccess<T>): Promise<RawPaginationResult<T>> => {
  const [{ data: items }, { data: itemsCount }] = await Promise.all([
    tryCatch(() => getItems()),
    tryCatch(() => getItemsCount()),
  ]);

  return { items, itemsCount };
};
export { paginateItems };
