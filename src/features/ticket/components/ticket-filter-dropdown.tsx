"use client";

import { useQueryState, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MaybeServerSession } from "@/features/auth/types";
import { scopeParser, sortParser } from "@/features/ticket/search-params";
import type { Prisma } from "@/generated/prisma/client";

type TicketFilterDropdownProps = {
  session: MaybeServerSession;
};

/**
 * Mobile filter dropdown that combines scope and sort options
 * Only visible on mobile screens (hidden on sm+)
 */
const TicketFilterDropdown = ({ session }: TicketFilterDropdownProps) => {
  const [scope, setScope] = useQueryState("scope", scopeParser);
  const [sort, setSort] = useQueryStates(sortParser);

  const handleScopeChange = (newScope: string) => {
    if (newScope === "mine" && !session?.user) {
      setScope("all");
      toast.info("Please sign in to view your tickets");
      return;
    }
    setScope(newScope as "all" | "mine");
  };

  const handleSortChange = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    setSort({
      sortKey,
      sortValue: sortValue as Prisma.SortOrder,
    });
  };

  const createKey = (sortKey: string, sortValue: string) =>
    `${sortKey}_${sortValue}`;

  // Create display text for button
  const scopeText = scope === "all" ? "All" : "My";
  const sortText = sort.sortKey === "bounty" ? "Bounty" : "Newest";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full sm:hidden" variant="outline">
          {scopeText} • {sortText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuRadioGroup onValueChange={handleScopeChange} value={scope}>
          <DropdownMenuRadioItem value="all">All Tickets</DropdownMenuRadioItem>
          {session?.user && (
            <DropdownMenuRadioItem value="mine">
              My Tickets
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          onValueChange={handleSortChange}
          value={createKey(sort.sortKey, sort.sortValue)}
        >
          <DropdownMenuRadioItem value={createKey("createdAt", "desc")}>
            Newest
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={createKey("bounty", "desc")}>
            Bounty
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketFilterDropdown;
