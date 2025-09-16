import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { SORT_ORDERS } from "@/features/constants";

export const options = {
  clearOnDefault: true,
  shallow: false,
};

export const searchParser = parseAsString.withDefault("").withOptions({
  ...options,
});

export const sortParser = {
  sortKey: parseAsString.withDefault("createdAt"),
  sortValue: parseAsStringLiteral(SORT_ORDERS as readonly string[]).withDefault(
    "desc",
  ),
};

const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 5;

export const paginationParser = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
};

export type PaginationType = {
  page: number;
  limit: number;
};

export const searchParamsParsers = {
  search: searchParser,
  ...sortParser,
  ...paginationParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
