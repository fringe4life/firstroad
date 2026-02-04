import { CardHeaderSkeleton } from "@/components/card-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TicketStatsCardSkeleton = () => (
  <Card className="md:row-span-2 md:grid md:grid-rows-subgrid">
    <CardHeaderSkeleton />
    <CardContent>
      <div className="flex flex-col gap-6">
        {/* Total Tickets */}
        <div className="flex items-center justify-between border-border border-b pb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-12" />
        </div>

        {/* Status Breakdown */}
        <div className="flex flex-col gap-4">
          {/* Open */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-sm" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-8" />
          </div>

          {/* In Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-8" />
          </div>

          {/* Done */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-sm" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-8" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export { TicketStatsCardSkeleton };
