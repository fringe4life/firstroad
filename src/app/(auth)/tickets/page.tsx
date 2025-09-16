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
      <Heading description="All your tickets at one place" title="My Tickets" />
      <CardCompact
        className="w-full max-w-105 self-center"
        content={<TicketUpsertForm />}
        description="A new ticket will be created"
        title="Create Ticket"
      />
    </div>
  );
};

export default TicketsPage;
