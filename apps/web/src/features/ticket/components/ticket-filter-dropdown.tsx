"use client";

import type { SortOrder } from "@firstroad/db/client-types";
import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortParser } from "@/features/pagination/pagination-search-params";

/**
 * Mobile filter dropdown that combines scope and sort options
 * Only visible on mobile screens (hidden on sm+)
 */
const sortLabels: Record<string, string> = {
  bounty: "Bounty",
  createdAt: "Newest",
  deadline: "Due soon",
};
const createKey = (sortKey: string, sortValue: string) =>
  `${sortKey}_${sortValue}`;
const TicketFilterDropdown = () => {
  const [sort, setSort] = useQueryStates(sortParser);

  const handleSortChange = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    setSort({
      sortKey,
      sortValue: sortValue as SortOrder,
    });
  };
  console.log(sort.sortKey, sort.sortValue);
  const sortText = sortLabels[sort.sortKey] ?? "Newest";
  console.log("[sortText]", sortText);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full sm:hidden" variant="outline">
          {sortText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          onValueChange={handleSortChange}
          value={createKey(sort.sortKey, sort.sortValue)}
        >
          <DropdownMenuRadioItem value={createKey("createdAt", "desc")}>
            Newest
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={createKey("deadline", "asc")}>
            Due soon
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={createKey("bounty", "desc")}>
            Bounty
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TicketFilterDropdown };
