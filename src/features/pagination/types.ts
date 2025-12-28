import type { Maybe } from "@/types";
import type { LIMITS } from "./constants";

export type List<T> = Maybe<T[]>;

interface PaginationMetadataObject {
  metadata: PaginationMetadata;
}
export interface PaginationMetadata {
  count: number;
  hasNextPage: boolean;
  nextCursor: Maybe<string>;
}

export interface PaginatedResult<T> extends PaginationMetadataObject {
  list: List<T>;
}

export interface DatabaseQueryResult<T> {
  items: List<T>;
  totalRows: Maybe<number>;
}

export type LimitItem = (typeof LIMITS)[number];
export interface PaginationType {
  page: number;
  limit: LimitItem;
}

export interface PaginationComponentProps extends PaginationMetadataObject {}

export interface PaginationProps extends PaginationMetadataObject {
  pagination: PaginationType;
  setPagination: (pagination: PaginationType) => void;
}
