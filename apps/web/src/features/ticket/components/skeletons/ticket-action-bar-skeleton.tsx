import { Skeleton } from "@/components/ui/skeleton";

const TicketActionBarSkeleton = () => (
  <div className="grid w-full grid-cols-3 gap-2 md:hidden">
    <Skeleton className="h-8 xs:w-20 rounded" />
    <Skeleton className="h-8 xs:w-20 rounded" />
    <Skeleton className="h-8 xs:w-20 rounded bg-destructive/50" />
  </div>
);

export { TicketActionBarSkeleton };
