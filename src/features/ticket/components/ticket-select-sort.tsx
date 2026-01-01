"use client";

import { useQueryStates } from "nuqs";
import { useTransition } from "react";
import {
  type SortObject,
  type SortOption,
  SortSelect,
} from "@/components/sort-select";
import {
  options as PaginationOptions,
  paginationParser,
  options as sortOptions,
  sortParser,
} from "@/features/pagination/pagination-search-params";

interface TicketSortSelectProps {
  options: readonly SortOption[];
}

const TicketSortSelect = ({ options }: TicketSortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);
  const [, setPagination] = useQueryStates(paginationParser, PaginationOptions);
  const [, startTransition] = useTransition();
  const handleChange = (sortArg: SortObject): void => {
    startTransition(async () => {
      await setSort({
        ...sortArg,
        sortValue: sort.sortValue,
      });
      await setPagination({ page: 0 });
    });
  };

  return (
    <SortSelect onValueChange={handleChange} options={options} value={sort} />
  );
};

export { TicketSortSelect };
