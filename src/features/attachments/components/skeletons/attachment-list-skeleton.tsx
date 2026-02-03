import { Skeleton } from "@/components/ui/skeleton";

const AttachmentListSkeleton = () => (
  <div className="grid gap-y-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
  </div>
);

export { AttachmentListSkeleton };
