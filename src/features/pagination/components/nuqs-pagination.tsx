"use client";

import { useQueryStates } from "nuqs";
import PaginationComponent from "@/features/pagination/components/pagination";
import {
  options as PaginationOptions,
  paginationParser,
} from "@/features/pagination/pagination-search-params";
import type { PaginationMetadata } from "@/features/pagination/types";

export type PaginationProps = {
  metadata: PaginationMetadata;
};

const Pagination = ({ metadata }: PaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    PaginationOptions,
  );

  return (
    <PaginationComponent
      metadata={metadata}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
};

export default Pagination;
