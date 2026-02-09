import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketActionBarSkeleton } from "./ticket-action-bar-skeleton";

const TicketItemSkeleton = () => (
  <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-[1fr_36px]">
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
          <Skeleton className="h-5 flex-1 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-11/12 rounded" />
          <Skeleton className="h-4 w-3/5 rounded" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-1 flex-col gap-y-1">
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="xs:hidden h-5 w-2/5 -translate-x-full xs:translate-x-0 xs:self-start self-end rounded" />
          </div>

          <Skeleton className="h-5 w-1/5 rounded" />
        </div>
        <TicketActionBarSkeleton />
      </CardFooter>
    </Card>

    {/* Desktop sidebar skeleton */}
    <div className="hidden space-y-1 md:flex md:flex-col">
      <IconButtonSkeleton />
      <IconButtonSkeleton />
    </div>
  </div>
);

export { TicketItemSkeleton };
