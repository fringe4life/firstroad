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

export interface RawPaginationAccess<T> {
  getItems: () => Promise<List<T>>;
  getItemsCount: () => Promise<Maybe<number>>;
}

export interface RawPaginationResult<T> {
  items: List<T>;
  itemsCount: Maybe<number>;
}

export type LimitItem = (typeof LIMITS)[number];

export type PaginationType = OffsetPaginationType | CursorPaginationType;

export interface OffsetPaginationType {
  page: number;
  limit: LimitItem;
  type: "offset";
}

export interface CursorPaginationType {
  cursor: Maybe<string>;
  limit: number;
  type: "cursor";
}

export interface PaginationComponentProps extends PaginationMetadataObject {}

export interface PaginationProps extends PaginationMetadataObject {
  pagination: OffsetPaginationType;
  setPagination: (pagination: Omit<OffsetPaginationType, "type">) => void;
}
