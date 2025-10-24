import { Suspense } from "react";
import GenericComponent from "@/components/generic-component";
import Placeholder from "@/components/placeholder";
import type { SortOption } from "@/components/sort-select";
import TicketControlsFallback from "@/features/ticket/components/ticket-controls-fallback";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketPagination from "@/features/ticket/components/ticket-pagination";
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
};

const TicketList = async ({ userId }: TicketListProps) => {
  const { list: tickets, metadata } = await getAllTickets(undefined, userId);
  const hasTickets = tickets.length > 0;
  return (
    <div className="grid justify-center gap-y-4">
      <Suspense fallback={<TicketControlsFallback />}>
        <div className="max-content-narrow grid grid-flow-col grid-cols-2 gap-x-2">
          <TicketSearchInput placeholder="Search tickets ..." />
          <TicketSortSelect options={TICKET_SORT_OPTIONS} />
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
