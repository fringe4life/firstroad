import { Suspense, ViewTransition } from "react";
import { GenericComponent } from "@/components/generic-component";
import { TICKET_SORT_OPTIONS } from "@/features/constants";
import { Pagination } from "@/features/pagination/components/nuqs-pagination";
import { TicketControlsFallback } from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import { TicketFilterDropdown } from "@/features/ticket/components/ticket-filter-dropdown";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { TicketSearchInput } from "@/features/ticket/components/ticket-search-input";
import { TicketSortSelect } from "@/features/ticket/components/ticket-select-sort";
import { getTickets } from "@/features/ticket/dal/get-tickets";
import type { TicketListProps } from "@/features/ticket/types";

const TicketList = async ({ searchParams, userId }: TicketListProps) => {
  const { list: tickets, metadata } = await getTickets(searchParams, userId);
  return (
    <div className="max-content-widest mx-auto grid justify-items-center gap-y-4">
      <Suspense fallback={<TicketControlsFallback />}>
        <ViewTransition>
          {/* Desktop: Stacked layout */}
          <div className="max-content-narrow hidden gap-y-2 sm:grid">
            <div className="grid grid-flow-col grid-cols-2 gap-x-2">
              <TicketSearchInput placeholder="Search tickets ..." />
              <TicketSortSelect options={TICKET_SORT_OPTIONS} />
            </div>
          </div>

          {/* Mobile: Two-column layout with dropdown */}
          <div className="max-content-narrow grid gap-y-2 sm:hidden">
            <div className="grid grid-flow-col grid-cols-2 gap-x-2">
              <TicketSearchInput placeholder="Search tickets ..." />
              <TicketFilterDropdown />
            </div>
          </div>
        </ViewTransition>
      </Suspense>
      <GenericComponent
        Component={TicketItem}
        className="grid h-full justify-items-center gap-y-4 self-start justify-self-stretch"
        emptyStateMessage="No tickets found"
        errorStateMessage="Failed to fetch tickets"
        items={tickets}
        renderProps={(ticket) => ({ isDetail: false, ticket })}
      />

      <div className="max-content-narrow">
        <Suspense>
          <ViewTransition>
            <Pagination metadata={metadata} />
          </ViewTransition>
        </Suspense>
      </div>
    </div>
  );
};

export { TicketList };
