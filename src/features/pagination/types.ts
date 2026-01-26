import type { List, Maybe } from "@/types";
import type { LIMITS } from "./constants";

/**
 * PAGINATION METADATA types
 */

export interface Page {
  page: number;
}
export interface PaginationMetadata extends Page {
  count: number;
  hasNextPage: boolean;
  nextCursor: Maybe<string>;
}
interface PaginationMetadataObject {
  metadata: PaginationMetadata;
}

/**
 * PAGINATION types
 */
export interface RawPaginationAccess<T> {
  getItems: () => Promise<List<T>>;
  getItemsCount: () => Promise<Maybe<number>>;
}

export interface RawPaginatedResult<T> {
  items: List<T>;
  itemsCount: Maybe<number>;
}

export interface PaginatedResult<T> extends PaginationMetadataObject {
  list: List<T>;
}

/**
 * PAGINATION COMPONENT types
 */

export type PaginationType = OffsetPaginationType | CursorPaginationType;

export interface OffsetPaginationType extends Page {
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

export type LimitItem = (typeof LIMITS)[number];
