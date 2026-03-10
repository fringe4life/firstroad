import { Skeleton } from "@/components/ui/skeleton";

const AcceptInvitationCardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2 text-center">
      <Skeleton className="mx-auto h-4 w-full" />
      <Skeleton className="mx-auto h-4 w-3/4" />
      <Skeleton className="mx-auto h-3 w-48" />
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Skeleton className="h-10 flex-1 bg-primary/50" />
      <Skeleton className="h-10 flex-[0.5]" />
    </div>
  </div>
);

export { AcceptInvitationCardSkeleton };
