import { Prisma } from "@prisma/client";
import {
	createSearchParamsCache,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

export const options = {
	clearOnDefault: true,
	shallow: false,
};

export const searchParser = parseAsString.withDefault("").withOptions({
	...options,
});

export const sortParser = {
	sortKey: parseAsString.withDefault("createdAt"),
	sortValue: parseAsStringLiteral(Object.values(Prisma.SortOrder)).withDefault(
		"desc",
	),
};

export const paginationParser = {
	page: parseAsInteger.withDefault(0),
	limit: parseAsInteger.withDefault(5),
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
