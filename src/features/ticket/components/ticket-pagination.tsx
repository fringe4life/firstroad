"use client";

import { useQueryStates } from "nuqs";
import Pagination from "@/components/pagination";
import {
  options as PaginationOptions,
  paginationParser,
} from "@/features/ticket/search-params";
import type { PaginationMetadata } from "@/features/types/pagination";

export type TicketPaginationProps = {
  metadata: PaginationMetadata;
};

const TicketPagination = ({ metadata }: TicketPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    PaginationOptions,
  );

  return (
    <Pagination
      metadata={metadata}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
};

export default TicketPagination;
