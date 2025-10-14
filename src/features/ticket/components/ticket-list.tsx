import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { Activity } from "react";
import { hasAuth } from "src/lib/auth-helpers";
import Placeholder from "@/components/placeholder";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketPagination from "@/features/ticket/components/ticket-pagination";
import TicketSearchInput from "@/features/ticket/components/ticket-search-input";
import TicketSortSelect from "@/features/ticket/components/ticket-select-sort";
import { getAllTickets } from "@/features/ticket/queries/get-tickets";

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
      <Activity mode={hasTickets ? "visible" : "hidden"}>
        {tickets.map((ticket) => (
          <TicketItem isDetail={false} key={ticket.id} ticket={ticket} />
        ))}
      </Activity>
      <Activity mode={hasTickets ? "hidden" : "visible"}>
        <Placeholder label="No tickets found" />
      </Activity>

      <div className="w-full max-w-105">
        <TicketPagination metadata={metadata} />
      </div>
    </div>
  );
};

export default TicketList;
