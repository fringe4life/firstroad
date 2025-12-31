import type { SearchParams } from "nuqs/server";

export type Maybe<T> = T | null | undefined;

export interface SearchParamsProps {
  searchParams: Promise<SearchParams>;
}

export interface ErrorProps {
  error: Error;
  reset: () => void;
}

export interface Id {
  id: string;
}
