import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { PaginationSkeleton } from "@/features/pagination/components/skeletons/pagination-skeleton";
import { TicketsControlSkeleton } from "@/features/ticket/components/skeletons/ticket-controls-skeleton";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";

const TicketsLoading = () => (
  <div className="grid h-full w-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
    <Heading description="All your tickets at one place" title="My Tickets" />
    <CardCompact
      className="max-content-narrow justify-self-center"
      content={<TicketFormSkeleton />}
      description="A new ticket will be created"
      title="Create Ticket"
    />
    <div className="grid grid-rows-[min-content_1fr] gap-y-4">
      <TicketsControlSkeleton />
      <TicketListSkeleton />
      <PaginationSkeleton />
    </div>
  </div>
);
export default TicketsLoading;
