"use cache";

import { Skeleton } from "@/components/ui/skeleton";

const TicketControlsFallback = async () => (
  <div className="max-content-narrow mx-auto grid xs:grid-flow-col xs:grid-cols-2 gap-2 justify-self-center">
    <Skeleton className="h-9 bg-muted-foreground/50" />
    <Skeleton className="h-9 bg-muted-foreground/50" />
  </div>
);

export { TicketControlsFallback };
