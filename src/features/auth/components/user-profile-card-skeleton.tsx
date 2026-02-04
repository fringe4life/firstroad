import { CardHeaderSkeleton } from "@/components/card-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfileCardSkeleton = () => (
  <Card className="md:row-span-2 md:grid md:grid-rows-subgrid">
    <CardHeaderSkeleton />
    <CardContent>
      <div className="flex flex-col gap-6">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4">
          <Skeleton className="aspect-square w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Email Verification Status */}
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export { UserProfileCardSkeleton };
