import type { SearchParams } from "nuqs/server";
import Placeholder from "@/components/placeholder";
import { getTickets } from "@/features/ticket/queries/get-tickets";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketPagination from "@/features/ticket/components/ticket-pagination";
import TicketSearchInput from "@/features/ticket/components/ticket-search-input";
import TicketSortSelect from "@/features/ticket/components/ticket-select-sort";

interface TicketListProps {
	userId?: string;
	searchParams: Promise<SearchParams>;
}

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
	const {list: tickets, metadata } = await getTickets(searchParams, userId);
	return (
		<div className="grid flex-1 justify-items-center gap-y-4 animate-fade-from-top">
			<div className="w-full max-w-105 grid grid-flow-col gap-x-2 grid-cols-2">
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
				tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
			) : (
				<Placeholder label="No tickets found" />
			)}
			<div className="max-w-105 w-full">
				<TicketPagination metadata={metadata} />
			</div>
		</div>
	);
};

export default TicketList;
