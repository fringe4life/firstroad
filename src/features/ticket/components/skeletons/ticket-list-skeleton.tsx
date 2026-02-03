import { TicketItemSkeleton } from "./ticket-item-skeleton";

const TicketListSkeleton = () => (
  <div className="grid h-full w-full justify-items-center">
    <div className="max-content-narrow grid gap-y-4">
      <TicketItemSkeleton />
      <TicketItemSkeleton />
      <TicketItemSkeleton />
      <TicketItemSkeleton />
      <TicketItemSkeleton />
    </div>
  </div>
);

export { TicketListSkeleton };
