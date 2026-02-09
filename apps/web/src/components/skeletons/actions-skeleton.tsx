import { Skeleton } from "@/components/ui/skeleton";

const ActionsSkeleton = () => (
  <div className="flex items-center gap-x-2">
    <Skeleton className="h-10 w-full" />
  </div>
);

export { ActionsSkeleton };
