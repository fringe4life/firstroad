import type { SearchParams } from "nuqs/server";
import Placeholder from "@/components/placeholder";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketPagination from "@/features/ticket/components/ticket-pagination";
import TicketSearchInput from "@/features/ticket/components/ticket-search-input";
import TicketSortSelect from "@/features/ticket/components/ticket-select-sort";
import { getTickets } from "@/features/ticket/queries/get-tickets";

interface TicketListProps {
  userId?: string;
  searchParams: Promise<SearchParams>;
}

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
  console.log("🎯 TicketList - userId:", userId);
  console.log("🎯 TicketList - searchParams:", searchParams);
  const { list: tickets, metadata } = await getTickets(searchParams, userId);
  console.log("🎯 TicketList - tickets:", tickets);
  console.log("🎯 TicketList - metadata:", metadata);
  return (
    <div className="grid flex-1 animate-fade-from-top justify-items-center gap-y-4">
      <div className="grid w-full max-w-105 grid-flow-col grid-cols-2 gap-x-2">
        <TicketSearchInput placeholder="Search tickets ..." />
        <TicketSortSelect
          options={[
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
          ]}
        />
      </div>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} isDetail={false} />
        ))
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
