import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const PaginationSkeleton = () => (
  <div className="max-content-narrow flex h-10 items-center justify-between">
    <Skeleton className="h-full w-[12ch]" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-16" />
      <IconButtonSkeleton />
      <IconButtonSkeleton />
    </div>
  </div>
);

export { PaginationSkeleton };
