import type { Metadata } from "next";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";

export const metadata: Metadata = {
	title: "My Tickets",
	description:
		"Manage your tickets, create new ones, and track your progress. View all tickets you've created and collaborated on.",
};

const TicketsPage = () => {
	return (
		<div className="flex flex-1 flex-col gap-y-8">
			<Heading title="My Tickets" description="All your tickets at one place" />
			<CardCompact
				className="w-full max-w-105 self-center"
				title="Create Ticket"
				description="A new ticket will be created"
				content={<TicketUpsertForm />}
			/>
		</div>
	);
};

export default TicketsPage;
