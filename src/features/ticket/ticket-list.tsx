import { getTickets } from "@/features/queries/get-tickets";
import TicketItem from "./ticket-item";
import SearchInput from "@/components/search-input";
import type { SearchParams } from "./search-params";
import Placeholder from "@/components/placeholder";
import SortSelect from "@/components/sort-select";

interface TicketListProps {
  userId?: string;
  search?: Awaited<SearchParams["searchParams"]>["search"];
}

const TicketList = async ({ userId, search }: TicketListProps) => {
  const tickets = await getTickets(userId, search);
  return (
    <div className='grid flex-1 justify-items-center gap-y-4 animate-fade-from-top'>
      <div className="w-full max-w-105 grid grid-flow-col gap-x-2">
        <SearchInput placeholder="Search tickets ..." />
        <SortSelect 
        defaultValue="newest"
        options={[
          { label: "Newest", value: "newest" },
          { label: "Bounty", value: "bounty" },
        ]} />
      </div>
      {tickets.length > 0 ? tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      )) : <Placeholder label="No tickets found" />}
    </div>
  );
};

export default TicketList;
