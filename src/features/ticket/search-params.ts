import { createSearchParamsCache, parseAsString } from "nuqs/server";
import {
  options,
  paginationParser,
  sortParser,
} from "../pagination/pagination-search-params";

export const searchParser = parseAsString.withDefault("").withOptions({
  ...options,
});

export const searchParamsParsers = {
  search: searchParser,
  ...sortParser,
  ...paginationParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
