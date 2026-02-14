import type { Metadata } from "next";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketsControlSkeleton } from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { Tickets } from "@/features/ticket/components/tickets";

export const metadata: Metadata = {
  title: "Our Tickets",
  description:
    "View and manage your organisation's tickets. Track your progress, update status, and collaborate with others.",
  openGraph: {
    title: "Our Tickets | First Road",
    description:
      "View and manage your organisation's tickets. Track your progress, update status, and collaborate with others.",
  },
};

const TicketsOrganisationPage = async ({
  searchParams,
}: PageProps<"/tickets">) => {
  await connection();
  await getUserOrRedirect();
  return (
    <>
      <Heading
        description="All your organisation's tickets at one place"
        title="Our Tickets"
      />
      <CardCompact
        className="max-content-narrow justify-self-center"
        content={
          <Suspend fallback={<TicketFormSkeleton />}>
            <TicketUpsertForm upsertTicketAction={upsertTicket} />
          </Suspend>
        }
        description="A new ticket will be created"
        title="Create Ticket"
      />
      <Suspend
        fallback={
          <>
            <TicketsControlSkeleton />
            <TicketListSkeleton />
          </>
        }
      >
        <Tickets byOrganisation searchParams={searchParams} />
      </Suspend>
    </>
  );
};

export default TicketsOrganisationPage;
