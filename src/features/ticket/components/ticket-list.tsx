import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { hasAuth } from "src/lib/auth-helpers";
import GenericComponent from "@/components/generic-component";
import Placeholder from "@/components/placeholder";
import type { SortOption } from "@/components/sort-select";
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
  searchParams: Promise<SearchParams>;
};

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
  await connection(); // Prevent static generation during build time

  const { list: tickets, metadata } = await hasAuth((session) =>
    getAllTickets(session, searchParams, userId),
  );
  const hasTickets = tickets.length > 0;
  return (
    <div className="grid flex-1 justify-items-center gap-y-4">
      <div className="grid w-full max-w-105 grid-flow-col grid-cols-2 gap-x-2">
        <TicketSearchInput placeholder="Search tickets ..." />
        <TicketSortSelect options={TICKET_SORT_OPTIONS} />
      </div>
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

      <div className="w-full max-w-105">
        <TicketPagination metadata={metadata} />
      </div>
    </div>
  );
};

export default TicketList;
