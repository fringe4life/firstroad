import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton for the form
const TicketFormSkeleton = () => (
  <div className="max-content-narrow mx-auto self-center">
    <Skeleton className="h-64 bg-muted-foreground/20" />
  </div>
);

export { TicketFormSkeleton };
