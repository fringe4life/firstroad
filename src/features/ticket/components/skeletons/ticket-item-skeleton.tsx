import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TicketItemSkeleton = () => (
  <div className="grid w-full grid-cols-[1fr_36px] gap-x-2">
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
      <CardFooter className="flex justify-between">
        <Skeleton className="h-5 w-3/5 rounded" />
        <Skeleton className="h-5 w-1/5 rounded" />
      </CardFooter>
    </Card>

    <IconButtonSkeleton />
  </div>
);

export { TicketItemSkeleton };
