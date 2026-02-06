import { Skeleton } from "@/components/ui/skeleton";

const AuthNavSkeleton = () => (
  <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-1">
    <Skeleton className="h-9 w-[86px]" />
    <Skeleton className="h-9 w-[77px] bg-primary/50" />
  </div>
);

export { AuthNavSkeleton };
