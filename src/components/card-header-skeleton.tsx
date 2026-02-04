import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardHeaderSkeleton = () => (
  <CardHeader>
    <CardTitle>
      <Skeleton className="h-6 w-30" />
    </CardTitle>
    <CardDescription>
      <Skeleton className="h-4 w-48" />
    </CardDescription>
  </CardHeader>
);

export { CardHeaderSkeleton };
