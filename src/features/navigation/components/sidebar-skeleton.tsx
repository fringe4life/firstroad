import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarSkeleton = () => (
  <>
    <Skeleton className="h-12 w-10" />
    <Skeleton className="h-12 w-10" />
    <Skeleton className="h-12 w-10" />
    <Separator />
    <Skeleton className="h-12 w-10" />
    <Skeleton className="h-12 w-10" />
  </>
);

export { SidebarSkeleton };
