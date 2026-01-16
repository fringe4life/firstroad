import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const PaginationSkeleton = () => (
  <div className="flex items-center justify-between">
    <Skeleton className="w-[16ch]" />
    <div className="flex items-center gap-2">
      <IconButtonSkeleton />
      <IconButtonSkeleton />
    </div>
  </div>
);

export { PaginationSkeleton };
