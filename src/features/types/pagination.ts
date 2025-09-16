export type PaginationMetadata = {
  count: number;
  hasNextPage: boolean;
  nextCursor?: string | null;
};

export type PaginatedResult<T> = {
  list: T[];
  metadata: PaginationMetadata;
};
