"use client";

import { useQueryState, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import Pagination from "@/components/pagination";
import {
  options as PaginationOptions,
  paginationParser,
  searchParser,
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

  const [search] = useQueryState("search", searchParser);

  const prevSearch = useRef(search);

  useEffect(() => {
    if (prevSearch.current !== search) {
      setPagination({
        ...pagination,
        page: 0,
      });
      prevSearch.current = search;
    }
  }, [search, pagination, setPagination]);

  return (
    <Pagination
      metadata={metadata}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
};

export default TicketPagination;
