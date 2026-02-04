import { Skeleton } from "@/components/ui/skeleton";

const ChangePasswordFormSkeleton = () => (
  <div className="flex flex-col gap-4">
    {/* Current password field */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>

    {/* New password field */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-full" />
    </div>

    {/* Confirm password field */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-full" />
    </div>

    {/* Checkbox */}
    <div className="flex items-center gap-2 py-2">
      <Skeleton className="size-4 rounded-sm" />
      <Skeleton className="h-4 w-48" />
    </div>

    {/* Submit button */}
    <Skeleton className="h-10 w-full" />
  </div>
);

export { ChangePasswordFormSkeleton };
