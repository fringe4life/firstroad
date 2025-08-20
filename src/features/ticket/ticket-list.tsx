import type { SearchParams } from "nuqs/server";
import Placeholder from "@/components/placeholder";
import SearchInput from "@/components/search-input";
import SortSelect from "@/components/sort-select";
import { getTickets } from "@/features/queries/get-tickets";
import TicketItem from "./ticket-item";

interface TicketListProps {
	userId?: string;
	searchParams?: Promise<SearchParams>;
}

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
	const tickets = await getTickets(userId, searchParams);
	return (
		<div className="grid flex-1 justify-items-center gap-y-4 animate-fade-from-top">
			<div className="w-full max-w-105 grid grid-flow-col gap-x-2 grid-cols-2">
				<SearchInput placeholder="Search tickets ..." />
				<SortSelect
					defaultValue="newest"
					options={[
						{ label: "Newest", value: "newest" },
						{ label: "Bounty", value: "bounty" },
					]}
				/>
			</div>
			{tickets.length > 0 ? (
				tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
			) : (
				<Placeholder label="No tickets found" />
			)}
		</div>
	);
};

export default TicketList;
