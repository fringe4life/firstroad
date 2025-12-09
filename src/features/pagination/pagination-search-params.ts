import {
  createSearchParamsCache,
  type Options,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const SORT_ORDERS = ["asc", "desc"] as const;

export const options: Options = {
  clearOnDefault: true,
  shallow: false,
};

export const searchParser = parseAsString.withDefault("").withOptions({
  ...options,
});

export const sortParser = {
  sortKey: parseAsString.withDefault("createdAt"),
  sortValue: parseAsStringLiteral(SORT_ORDERS).withDefault("desc"),
};

const DEFAULT_PAGE = 0;
export const DEFAULT_LIMIT = 10 as const;
export const LIMITS = [5, 10, 25, 50, 100] as const;

export type LimitItem = (typeof LIMITS)[number];

export const paginationParser = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT),
};

export type PaginationType = {
  page: number;
  limit: LimitItem;
};

export const searchParamsParsers = {
  search: searchParser,
  ...sortParser,
  ...paginationParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
