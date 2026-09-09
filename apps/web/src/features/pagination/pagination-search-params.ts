import {
  createSearchParamsCache,
  type Options,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  LIMITS,
  SORT_ORDERS,
} from "@/features/pagination/constants";

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

export const paginationParser = {
  limit: parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT),
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
};

const searchParamsParsers = {
  search: searchParser,
  ...sortParser,
  ...paginationParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
