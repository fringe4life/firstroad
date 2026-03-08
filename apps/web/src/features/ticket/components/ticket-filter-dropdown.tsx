"use client";

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
import { createKey } from "@/utils/create-key";
import { isSortOrder } from "@/utils/is-sort-order";

/**
 * Mobile filter dropdown that combines scope and sort options
 * Only visible on mobile screens (hidden on sm+)
 */
const sortLabels: Record<string, string> = {
  bounty: "Bounty",
  createdAt: "Newest",
  deadline: "Due soon",
};

const TicketFilterDropdown = () => {
  const [sort, setSort] = useQueryStates(sortParser);

  const handleSortChange = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    if (!isSortOrder(sortValue)) {
      return;
    }
    setSort({
      sortKey,
      sortValue,
    });
  };
  const sortText = sortLabels[sort.sortKey] ?? "Newest";
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
          value={createKey(sort)}
        >
          <DropdownMenuRadioItem
            value={createKey({ sortKey: "createdAt", sortValue: "desc" })}
          >
            Newest
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={createKey({ sortKey: "deadline", sortValue: "asc" })}
          >
            Due soon
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={createKey({ sortKey: "bounty", sortValue: "desc" })}
          >
            Bounty
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TicketFilterDropdown };
