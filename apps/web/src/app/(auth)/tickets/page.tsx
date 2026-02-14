import type { Metadata } from "next";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { PaginationSkeleton } from "@/features/pagination/components/skeletons/pagination-skeleton";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketsControlSkeleton } from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { Tickets } from "@/features/ticket/components/tickets";

export const metadata: Metadata = {
  title: "My Tickets",
  description:
    "View and manage your personal tickets. Track your progress, update status, and collaborate with others.",
  openGraph: {
    title: "My Tickets | First Road",
    description:
      "View and manage your personal tickets. Track your progress, update status, and collaborate with others.",
  },
};

const TicketsPage = async ({ searchParams }: PageProps<"/tickets">) => {
  await connection();
  const user = await getUserOrRedirect();
  return (
    <div className="grid h-full w-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
      <Heading description="All your tickets at one place" title="My Tickets" />
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
          <div className="grid grid-rows-[min-content_1fr] gap-y-4">
            <TicketsControlSkeleton />
            <TicketListSkeleton />
            <PaginationSkeleton />
          </div>
        }
      >
        <Tickets searchParams={searchParams} userId={user.id} />
      </Suspend>
    </div>
  );
};

export default TicketsPage;
