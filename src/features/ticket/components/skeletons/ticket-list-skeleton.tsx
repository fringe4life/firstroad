import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";

const TicketListSkeleton = () => (
  <div className="grid h-full justify-items-center">
    <div className="max-content-narrow grid grid-cols-[1fr_36px] justify-center gap-x-2 gap-y-4">
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
    </div>
  </div>
);

export { TicketListSkeleton };
