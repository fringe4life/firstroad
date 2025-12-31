import { Suspense, ViewTransition } from "react";
import GenericComponent from "@/components/generic-component";
import { getUser } from "@/features/auth/queries/get-user";
import { TICKET_SORT_OPTIONS } from "@/features/constants";
import { Pagination } from "@/features/pagination/components/nuqs-pagination";
import TicketControlsFallback from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import TicketFilterDropdown from "@/features/ticket/components/ticket-filter-dropdown";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketScopeToggle from "@/features/ticket/components/ticket-scope-toggle";
import TicketSearchInput from "@/features/ticket/components/ticket-search-input";
import TicketSortSelect from "@/features/ticket/components/ticket-select-sort";
import { getAllTickets } from "@/features/ticket/dal/get-tickets";
import type { SearchParamsProps } from "@/types";

const TicketList = async ({ searchParams }: SearchParamsProps) => {
  const { user } = await getUser();
  const { list: tickets, metadata } = await getAllTickets(
    searchParams,
    user?.id,
  );

  return (
    <div className="grid justify-center gap-y-4">
      <Suspense fallback={<TicketControlsFallback />}>
        {/* Desktop: Stacked layout with scope toggle below */}
        <div className="max-content-narrow hidden gap-y-2 sm:grid">
          <div className="grid grid-flow-col grid-cols-2 gap-x-2">
            <TicketSearchInput placeholder="Search tickets ..." />
            <TicketSortSelect options={TICKET_SORT_OPTIONS} />
          </div>
          <TicketScopeToggle user={user} />
        </div>

        {/* Mobile: Two-column layout with dropdown */}
        <div className="max-content-narrow grid gap-y-2 sm:hidden">
          <div className="grid grid-flow-col grid-cols-2 gap-x-2">
            <TicketSearchInput placeholder="Search tickets ..." />
            <TicketFilterDropdown user={user} />
          </div>
        </div>
      </Suspense>
      <GenericComponent
        Component={TicketItem}
        className="grid gap-y-4"
        emptyStateMessage="No Tickets Found"
        items={tickets}
        renderKey={(ticket) => ticket.slug}
        renderProps={(ticket) => ({ isDetail: false, ticket })}
      />

      <div className="max-content-narrow">
        <ViewTransition>
          <Suspense>
            <Pagination metadata={metadata} />
          </Suspense>
        </ViewTransition>
      </div>
    </div>
  );
};

export default TicketList;
