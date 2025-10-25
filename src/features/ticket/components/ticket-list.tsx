import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import GenericComponent from "@/components/generic-component";
import Placeholder from "@/components/placeholder";
import type { SortOption } from "@/components/sort-select";
import { getSession } from "@/features/auth/queries/get-session";
import TicketControlsFallback from "@/features/ticket/components/ticket-controls-fallback";
import TicketFilterDropdown from "@/features/ticket/components/ticket-filter-dropdown";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketPagination from "@/features/ticket/components/ticket-pagination";
import TicketScopeToggle from "@/features/ticket/components/ticket-scope-toggle";
import TicketSearchInput from "@/features/ticket/components/ticket-search-input";
import TicketSortSelect from "@/features/ticket/components/ticket-select-sort";
import { getAllTickets } from "@/features/ticket/queries/get-tickets";

const TICKET_SORT_OPTIONS: readonly SortOption[] = [
  {
    label: "Newest",
    sortKey: "createdAt",
    sortValue: "desc",
  },
  {
    label: "Bounty",
    sortKey: "bounty",
    sortValue: "desc",
  },
];

type TicketListProps = {
  userId?: string;
  searchParams?: Promise<SearchParams>;
};

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
  const session = await getSession();
  const { list: tickets, metadata } = await getAllTickets(searchParams, userId);
  const hasTickets = tickets.length > 0;
  return (
    <div className="grid justify-center gap-y-4">
      <Suspense fallback={<TicketControlsFallback />}>
        {/* Desktop: Stacked layout with scope toggle below */}
        <div className="max-content-narrow hidden gap-y-2 sm:grid">
          <div className="grid grid-flow-col grid-cols-2 gap-x-2">
            <TicketSearchInput placeholder="Search tickets ..." />
            <TicketSortSelect options={TICKET_SORT_OPTIONS} />
          </div>
          <TicketScopeToggle session={session} />
        </div>

        {/* Mobile: Two-column layout with dropdown */}
        <div className="max-content-narrow grid gap-y-2 sm:hidden">
          <div className="grid grid-flow-col grid-cols-2 gap-x-2">
            <TicketSearchInput placeholder="Search tickets ..." />
            <TicketFilterDropdown session={session} />
          </div>
        </div>
      </Suspense>
      {hasTickets ? (
        <GenericComponent
          Component={TicketItem}
          className="grid gap-y-4"
          items={tickets}
          renderKey={(ticket) => ticket.id}
          renderProps={(ticket) => ({ isDetail: false as const, ticket })}
        />
      ) : (
        <Placeholder label="No tickets found" />
      )}

      <div className="max-content-narrow">
        <Suspense>
          <TicketPagination metadata={metadata} />
        </Suspense>
      </div>
    </div>
  );
};

export default TicketList;
