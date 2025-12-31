"use client";

import { useQueryStates } from "nuqs";
import { OffsetPagination } from "@/features/pagination/components/pagination";
import {
  options as PaginationOptions,
  paginationParser,
} from "@/features/pagination/pagination-search-params";
import type { PaginationComponentProps } from "@/features/pagination/types";

const Pagination = ({ metadata }: PaginationComponentProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    PaginationOptions,
  );

  return (
    <OffsetPagination
      metadata={metadata}
      pagination={{ ...pagination, type: "offset" }}
      setPagination={setPagination}
    />
  );
};

export { Pagination };
