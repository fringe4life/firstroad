import type { Prisma } from "@/generated/prisma/client";

const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10 as const;
const LIMITS = [5, 10, 25, 50, 100] as const;

const NO_PAGINATION = {
  list: [],
  metadata: {
    count: 0,
    hasNextPage: false,
    nextCursor: null,
  },
};

// Sort orders used in UI and parsers - matches Prisma.SortOrder
const SORT_ORDERS: Prisma.SortOrder[] = ["asc", "desc"] as const;

export { DEFAULT_LIMIT, DEFAULT_PAGE, NO_PAGINATION, SORT_ORDERS, LIMITS };
