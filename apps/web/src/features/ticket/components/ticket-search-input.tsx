"use client";

import {
  debounce,
  defaultRateLimit,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useTransition } from "react";
import { SearchInput } from "@/components/search-input";
import {
  options,
  paginationParser,
  searchParser,
} from "@/features/pagination/pagination-search-params";

interface TicketSearchInputProps {
  placeholder?: string;
}

const DEBOUNCE_DELAY_MS = 250;

const TicketSearchInput = ({
  placeholder = "Search tickets ...",
}: TicketSearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);
  const [pagination, setPagination] = useQueryStates(paginationParser, options);
  const [, startTransition] = useTransition();
  return (
    <SearchInput
      onChange={(value) => {
        startTransition(async () => {
          await setSearch(value, {
            limitUrlUpdates:
              value === "" ? defaultRateLimit : debounce(DEBOUNCE_DELAY_MS),
          });

          // Reset to first page when search changes
          if (pagination.page !== 0) {
            await setPagination({ page: 0 });
          }
        });
      }}
      placeholder={placeholder}
      value={search}
    />
  );
};

export { TicketSearchInput };
