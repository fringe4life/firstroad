import { CardHeaderSkeleton } from "@/components/card-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CommentFormSkeleton = () => (
  <Card>
    <CardHeaderSkeleton />
    <CardContent>
      <div className="grid gap-y-2">
        <div className="grid gap-y-4">
          {/* Label skeleton */}
          <Skeleton className="h-5 w-32" />

          {/* Textarea skeleton */}
          <Skeleton className="h-25 w-full rounded-md" />
        </div>

        {/* Button skeleton */}
        <div className="flex gap-x-2">
          <Skeleton className="h-10 w-32 rounded-md bg-primary/20" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export { CommentFormSkeleton };
