"use client";

import { debounce, useQueryState } from "nuqs";
import SearchInput from "@/components/search-input";
import { searchParser } from "@/features/ticket/search-params";

interface TicketSearchInputProps {
  placeholder?: string;
}

const TicketSearchInput = ({
  placeholder = "Search tickets ...",
}: TicketSearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);

  return (
    <SearchInput
      value={search}
      onChange={(value) => setSearch(value, { limitUrlUpdates: debounce(250) })}
      placeholder={placeholder}
    />
  );
};

export default TicketSearchInput;
