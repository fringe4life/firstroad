import type { Maybe } from "@/types";

export type PaginationMetadata = {
  count: number;
  hasNextPage: boolean;
  nextCursor: Maybe<string>;
};

type List<T> = Maybe<T[]>;

export type PaginatedResult<T> = {
  list: List<T>;
  metadata: PaginationMetadata;
};

export type DatabaseQueryResult<T> = {
  items: List<T>;
  totalRows: Maybe<number>;
};
