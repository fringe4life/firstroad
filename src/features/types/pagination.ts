import type { Maybe } from "@/types";

export type PaginationMetadata = {
  count: number;
  hasNextPage: boolean;
  nextCursor: Maybe<string>;
};

export type PaginatedResult<T> = {
  list: T[];
  metadata: PaginationMetadata;
};
