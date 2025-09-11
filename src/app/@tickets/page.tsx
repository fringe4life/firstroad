import TicketList from "@/features/ticket/components/ticket-list";

export default function Tickets({ searchParams }: PageProps<"/">) {
	return (
		<div className="flex flex-1 flex-col items-center gap-y-4">
			<TicketList searchParams={searchParams} />
		</div>
	);
}
