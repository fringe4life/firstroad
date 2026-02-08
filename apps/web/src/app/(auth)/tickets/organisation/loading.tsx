import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { TicketControlsFallback } from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";

const TicketsOrganisationLoading = () => (
  <>
    <Heading
      description="All your organisation's tickets at one place"
      title="Our Tickets"
    />
    <CardCompact
      className="max-content-narrow justify-self-center"
      content={<TicketFormSkeleton />}
      description="A new ticket will be created"
      title="Create Ticket"
    />
    <TicketControlsFallback />
    <TicketListSkeleton />
  </>
);

export default TicketsOrganisationLoading;
