import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/path";

export const generateMetadata = async ({
	params,
}: PageProps<"/tickets/[ticketId]">): Promise<Metadata> => {
	const { ticketId } = await params;
	const ticket = await getTicket(ticketId);

	if (!ticket) {
		return {
			title: "Ticket Not Found",
			description: "The requested ticket could not be found.",
		};
	}

	return {
		title: ticket.title,
		description:
			ticket.description || "View ticket details and collaborate with others.",
	};
};

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
			<div className="flex animate-fade-from-top justify-center">
				<TicketItem ticket={ticket} isDetail={true} />
			</div>
		</>
	);
};

export default Ticket;
