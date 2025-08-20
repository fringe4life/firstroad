import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const searchParamsParsers = {
	search: parseAsString.withDefault(""),
	sort: parseAsString.withDefault("newest"),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);