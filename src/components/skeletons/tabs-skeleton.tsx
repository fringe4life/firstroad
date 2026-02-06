import { Skeleton } from "@/components/ui/skeleton";

const TabsSkeleton = () => (
  <div className="inline-flex h-9 w-fit items-center gap-[3px] justify-self-start rounded-lg bg-muted p-[3px]">
    <Skeleton className="h-[calc(100%-1px)] w-24 rounded-md" />
    <Skeleton className="h-[calc(100%-1px)] w-24 rounded-md" />
  </div>
);

export { TabsSkeleton };
