import type { SearchParams } from "nuqs/server";

export type Maybe<T> = T | null | undefined;

export type List<T> = Maybe<T[]>;

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

export interface UnsuccessfulState {
  emptyStateMessage: string;
  errorStateMessage?: string;
}

export interface Rows {
  rows?: number;
}
