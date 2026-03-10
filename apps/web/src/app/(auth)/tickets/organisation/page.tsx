import type { Metadata } from "next";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Suspend } from "@/components/suspend";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { canCreate } from "@/features/memberships/utils/permission";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { OrganisationTicketsHeading } from "@/features/ticket/components/organisation-tickets-heading";
import { TicketsControlSkeleton } from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";
import { TicketCreateDisabledCard } from "@/features/ticket/components/ticket-create-disabled-card";
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
  const user = await getUserOrRedirect();
  const organizationId = user.activeOrganizationId;
  const canCreateTicket = organizationId
    ? await canCreate(user, organizationId, "TICKET")
    : false;
  return (
    <>
      <OrganisationTicketsHeading />
      {canCreateTicket ? (
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
      ) : (
        <TicketCreateDisabledCard />
      )}
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
