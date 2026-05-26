import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";

const TicketActionsDesktopSkeleton = () => (
  <div className="hidden gap-y-1 self-start md:flex md:flex-col">
    <IconButtonSkeleton />
    <IconButtonSkeleton />
  </div>
);

export { TicketActionsDesktopSkeleton };
