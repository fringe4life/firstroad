import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import TicketItem from "@/features/ticket/components/ticket-item";
import { homePath } from "@/path";

export async function generateMetadata({ params }: PageProps<"/tickets/[ticketId]">): Promise<Metadata> {
	const param = await params;
	const ticket = await getTicket(param.ticketId);

	if (!ticket) {
		return {
			title: "Ticket Not Found | First Road",
			description: "The requested ticket could not be found.",
		};
	}

	return {
		title: `${ticket.title} | First Road`,
		description: ticket.description || `View details for ticket: ${ticket.title}`,
	};
}

const Ticket = async ({ params }: PageProps<"/tickets/[ticketId]">) => {
	const param = await params;

	const ticket = await getTicket(param.ticketId);

	if (!ticket) notFound();

	return (
		<>
			<div className="flex flex-1 flex-col gap-y-8">
				<Breadcrumbs
					breadcrumbs={[
						{ title: "Tickets", href: homePath },
						{ title: ticket.title },
					]}
				/>
			</div>
			<Separator />
			<div className="flex justify-center animate-fade-from-top">
				<TicketItem ticket={ticket} isDetail={true} />
			</div>
		</>
	);
};

export default Ticket;
