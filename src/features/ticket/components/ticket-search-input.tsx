"use client";

import { debounce, useQueryState } from "nuqs";
import SearchInput from "@/components/search-input";
import { searchParser } from "@/features/ticket/search-params";

type TicketSearchInputProps = {
  placeholder?: string;
};

const DEBOUNCE_DELAY_MS = 250;

const TicketSearchInput = ({
  placeholder = "Search tickets ...",
}: TicketSearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);

  return (
    <SearchInput
      onChange={(value) =>
        setSearch(value, { limitUrlUpdates: debounce(DEBOUNCE_DELAY_MS) })
      }
      placeholder={placeholder}
      value={search}
    />
  );
};

export default TicketSearchInput;
