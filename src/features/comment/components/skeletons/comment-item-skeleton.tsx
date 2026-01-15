import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const CommentItemSkeleton = () => {
  return (
    <div className="grid grid-cols-[1fr_36px] gap-x-2">
      <Skeleton className="h-30" />
      <IconButtonSkeleton />
    </div>
  );
};

export { CommentItemSkeleton };
