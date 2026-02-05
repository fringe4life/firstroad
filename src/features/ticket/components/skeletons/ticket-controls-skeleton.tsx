"use cache";

import { Skeleton } from "@/components/ui/skeleton";

const TicketControlsFallback = async () => (
  <div className="max-content-narrow mx-auto grid grid-flow-col grid-cols-2 gap-x-2 justify-self-center">
    <Skeleton className="h-9 bg-muted-foreground/50" />
    <Skeleton className="h-9 bg-muted-foreground/50" />
  </div>
);

export { TicketControlsFallback };
