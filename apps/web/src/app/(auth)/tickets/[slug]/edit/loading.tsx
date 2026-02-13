import { CardCompact } from "@/components/card-compact";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketFormSkeleton } from "@/features/ticket/components/skeletons/ticket-form-skeleton";

const TicketEditLoading = () => (
  <>
    <Skeleton className="h-5 w-full" />
    <CardCompact
      className="max-content-widest place-self-center"
      content={<TicketFormSkeleton />}
      description="Edit your ticket"
      title="Edit Ticket"
    />
  </>
);

export default TicketEditLoading;
