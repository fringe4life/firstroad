import {
  createSearchParamsCache,
  type inferParserType,
  type Options,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { SORT_ORDERS } from "@/features/constants";

export const options: Options = {
  clearOnDefault: true,
  shallow: false,
};

export const searchParser = parseAsString.withDefault("").withOptions({
  ...options,
});

export const scopeParser = parseAsStringLiteral(["all", "mine"])
  .withDefault("all")
  .withOptions({
    ...options,
  });

export type Scope = inferParserType<typeof scopeParser>;

export const sortParser = {
  sortKey: parseAsString.withDefault("createdAt"),
  sortValue: parseAsStringLiteral(SORT_ORDERS as readonly string[]).withDefault(
    "desc",
  ),
};

const DEFAULT_PAGE = 0;
export const DEFAULT_LIMIT = 5;

export const LIMITS = [5, 10, 25, 50, 100] as const;

export const paginationParser = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT),
};

export type PaginationType = {
  page: number;
  limit: (typeof LIMITS)[number];
};

export const searchParamsParsers = {
  search: searchParser,
  ...sortParser,
  ...paginationParser,
  scope: scopeParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
