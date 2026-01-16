import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const TicketListSkeleton = () => (
  <div className="grid h-full w-full justify-items-center">
    <div className="max-content-narrow grid grid-cols-[1fr_36px] justify-center gap-x-2 gap-y-4">
      <Skeleton className="h-55 w-full rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
      <Skeleton className="h-55 w-full rounded-lg bg-muted-foreground/50" />
      <div className="grid items-start gap-y-2 self-start">
        <IconButtonSkeleton />
        <IconButtonSkeleton />
      </div>
      <Skeleton className="h-55 w-full rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
      <Skeleton className="h-55 w-full rounded-lg bg-muted-foreground/50" />
      <IconButtonSkeleton />
    </div>
  </div>
);

export { TicketListSkeleton };
