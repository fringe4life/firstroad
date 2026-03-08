import type { SortObject, SortOption } from "@/components/sort-select";

const createKey = (option: SortOption | SortObject) =>
  `${option.sortKey}_${option.sortValue}`;

export { createKey };
