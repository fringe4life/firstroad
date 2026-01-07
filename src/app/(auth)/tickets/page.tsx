import type { Metadata } from "next";
import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { RequireAuthSuspense } from "@/features/auth/components/require-auth";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { signInPath } from "@/path";

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

const TicketsPage = ({ searchParams }: PageProps<"/tickets">) => {
  return (
    <div className="grid h-full w-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
      <Heading description="All your tickets at one place" title="My Tickets" />
      <CardCompact
        className="max-content-narrow justify-self-center"
        content={
          <Suspense fallback={<TicketFormSkeleton />}>
            <TicketUpsertForm upsertTicketAction={upsertTicket} />
          </Suspense>
        }
        description="A new ticket will be created"
        title="Create Ticket"
      />
      <RequireAuthSuspense
        fallback={<TicketListSkeleton />}
        redirectPath={signInPath()}
      >
        {async (user) => (
          <TicketList searchParams={searchParams} userId={user.id} />
        )}
      </RequireAuthSuspense>
    </div>
  );
};

export default TicketsPage;
