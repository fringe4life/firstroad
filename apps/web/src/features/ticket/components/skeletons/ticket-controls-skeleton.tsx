"use cache";

import { Skeleton } from "@/components/ui/skeleton";

const TicketsControlSkeleton = async () => (
  <div className="max-content-narrow mx-auto grid grid-flow-col grid-cols-[2fr_1fr] xs:grid-cols-[0.55fr_0.45fr] gap-2">
    <Skeleton className="h-9 bg-muted-foreground/50" />
    <Skeleton className="h-9 bg-muted-foreground/50" />
  </div>
);

export { TicketsControlSkeleton };
