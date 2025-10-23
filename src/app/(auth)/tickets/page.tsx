import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";

export const metadata: Metadata = {
  title: "My Tickets",
  description:
    "Manage your tickets, create new ones, and track your progress. View all tickets you've created and collaborated on.",
};

// biome-ignore lint/suspicious/useAwait: required for "use cache"
const TicketCreationForm = async () => {
  "use cache";
  cacheLife("days");
  return (
    <>
      <Heading description="All your tickets at one place" title="My Tickets" />
      <CardCompact
        className="w-full max-w-105 self-center"
        content={<TicketUpsertForm upsertTicketAction={upsertTicket} />}
        description="A new ticket will be created"
        title="Create Ticket"
      />
    </>
  );
};

const TicketsPage = () => (
  <div className="flex flex-1 flex-col gap-y-8">
    <TicketCreationForm />
    <TicketList />
  </div>
);

export default TicketsPage;
