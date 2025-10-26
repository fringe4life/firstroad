"use client";

import { debounce, useQueryState, useQueryStates } from "nuqs";
import SearchInput from "@/components/search-input";
import {
  options as PaginationOptions,
  paginationParser,
  searchParser,
} from "@/features/ticket/search-params";

type TicketSearchInputProps = {
  placeholder?: string;
};

const DEBOUNCE_DELAY_MS = 250;

const TicketSearchInput = ({
  placeholder = "Search tickets ...",
}: TicketSearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);
  const [, setPagination] = useQueryStates(paginationParser, PaginationOptions);

  return (
    <SearchInput
      onChange={(value) => {
        setSearch(value, { limitUrlUpdates: debounce(DEBOUNCE_DELAY_MS) });
        // Reset to first page when search changes
        setPagination({ page: 0 });
      }}
      placeholder={placeholder}
      value={search}
    />
  );
};

export default TicketSearchInput;
