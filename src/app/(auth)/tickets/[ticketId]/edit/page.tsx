import { notFound } from "next/navigation";
import { auth } from "@/app/auth";
import Breadcrumbs from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import { isOwner } from "@/features/auth/utils/owner";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { homePath, ticketPath } from "@/path";

type TicketEditPageProps = {
	params: Promise<{
		ticketId: string;
	}>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
	const param = await params;
	const ticket = await getTicket(param.ticketId);

	if (!ticket || !ticket.isOwner) notFound();

	return (
		<>
			<div className="flex flex-1 flex-col gap-y-8">
				<Breadcrumbs
					breadcrumbs={[
						{ title: "Tickets", href: homePath() },
						{ title: ticket.title, href: ticketPath(ticket.id) },
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
