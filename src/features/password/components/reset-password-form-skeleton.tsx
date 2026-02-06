import { Skeleton } from "@/components/ui/skeleton";

const ResetPasswordFormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-full" />
    </div>

    <Skeleton className="h-10 w-full bg-primary/50" />
  </div>
);

export { ResetPasswordFormSkeleton };
