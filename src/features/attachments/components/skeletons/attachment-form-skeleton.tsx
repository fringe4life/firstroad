import { Skeleton } from "@/components/ui/skeleton";

const AttachmentFormSkeleton = () => (
  <div className="grid gap-y-2">
    <Skeleton className="h-4 w-12" />
    <Skeleton className="h-9 w-full" />
    <Skeleton className="h-9 w-full bg-primary/50" />
  </div>
);

export { AttachmentFormSkeleton };
