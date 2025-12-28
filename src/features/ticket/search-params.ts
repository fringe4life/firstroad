import {
  createSearchParamsCache,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import {
  options,
  paginationParser,
  sortParser,
} from "../pagination/pagination-search-params";

export const searchParser = parseAsString.withDefault("").withOptions({
  ...options,
});

export const scopeParser = parseAsStringLiteral(["all", "mine"])
  .withDefault("all")
  .withOptions({
    ...options,
  });

export const searchParamsParsers = {
  search: searchParser,
  ...sortParser,
  ...paginationParser,
  scope: scopeParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
