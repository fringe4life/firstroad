import type { SortOrder } from "@firstroad/db/client-types";

const isSortOrder = (s: string): s is SortOrder => s === "asc" || s === "desc";

export { isSortOrder };
