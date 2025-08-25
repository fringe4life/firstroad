import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Route } from "next";
import Breadcrumbs from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { homePath, ticketPath } from "@/path";

export async function generateMetadata({ params }: PageProps<"/tickets/[ticketId]/edit">): Promise<Metadata> {
	const param = await params;
	const ticket = await getTicket(param.ticketId);

	if (!ticket || !ticket.isOwner) {
		return {
			title: "Access Denied | First Road",
			description: "You don't have permission to edit this ticket.",
		};
	}

	return {
		title: `Edit ${ticket.title} | First Road`,
		description: `Edit ticket: ${ticket.title}. Update the title, description, status, bounty, and deadline.`,
	};
}

const TicketEditPage = async ({
	params,
}: PageProps<"/tickets/[ticketId]/edit">) => {
	const param = await params;
	const ticket = await getTicket(param.ticketId);

	if (!ticket || !ticket.isOwner) notFound();

	return (
		<>
			<div className="flex flex-1 flex-col gap-y-8">
				<Breadcrumbs
					breadcrumbs={[
						{ title: "Tickets", href: homePath },
						{ title: ticket.title, href: ticketPath(ticket.id) as Route },
						{ title: "Edit" },
					]}
				/>
			</div>
			<Separator />
			<div className="flex-1 flex flex-col justfy-center items-center">
				<CardCompact
					title="Edit Ticket"
					description="Edit an existing ticket"
					className="w-full max-w-120 self-center animate-fade-from-top"
					content={<TicketUpsertForm ticket={ticket} />}
				/>
			</div>
		</>
	);
};

export default TicketEditPage;
