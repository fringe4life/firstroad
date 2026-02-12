import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionsSkeleton } from "./actions-skeleton";
import { TabsSkeleton } from "./tabs-skeleton";

interface HeadingSkeletonProps {
  showTabs?: boolean;
  showActions?: boolean;
}

const HeadingSkeleton = ({
  showTabs = false,
  showActions = false,
}: HeadingSkeletonProps) => (
  <>
    {showTabs && <TabsSkeleton />}
    <div
      className="grid h-min w-full grid-cols-1 items-center justify-between gap-x-4 self-start px-4 data-[item='true']:grid-cols-[max-content_0.5fr] sm:px-8 lg:data-[item='true']:grid-cols-[max-content_0.35fr] xl:data-[item='true']:grid-cols-[max-content_0.25fr]"
      data-item={Boolean(showActions)}
    >
      <div className="w-full space-y-2 justify-self-stretch">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      {showActions && <ActionsSkeleton />}
    </div>
    <Separator />
  </>
);

export { HeadingSkeleton };
