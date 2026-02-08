import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton for the form
const TicketFormSkeleton = () => (
  <div className="max-content-narrow mx-auto space-y-2 self-center">
    {/* Title field */}
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-12" />
      <Skeleton className="h-9 w-full bg-muted-foreground/20" />
    </div>

    {/* Description field */}
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-16" />
      <Skeleton className="h-16 w-full bg-muted-foreground/20" />
    </div>

    {/* Deadline and Bounty fields - side by side */}
    <div className="mb-1 flex gap-x-2">
      <div className="w-1/2 space-y-2">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-9 w-full bg-muted-foreground/20" />
      </div>
      <div className="w-1/2 space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-9 w-full bg-muted-foreground/20" />
      </div>
    </div>

    {/* Submit button */}
    <Skeleton className="h-9 w-full bg-muted-foreground/20" />
  </div>
);

export { TicketFormSkeleton };
