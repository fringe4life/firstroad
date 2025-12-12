import type { SearchParams } from "nuqs/server";

export type Maybe<T> = T | null | undefined;

export type SearchParamsProps = {
  searchParams: Promise<SearchParams>;
};

export type ErrorProps = {
  error: Error;
  reset: () => void;
};
