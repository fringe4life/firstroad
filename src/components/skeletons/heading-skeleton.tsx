import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface HeadingSkeletonProps {
  showTabs?: boolean;
  showActions?: boolean;
}

const HeadingSkeleton = ({
  showTabs = false,
  showActions = false,
}: HeadingSkeletonProps) => (
  <>
    {showTabs && (
      <div className="inline-flex h-9 w-fit items-center gap-[3px] justify-self-start rounded-lg bg-muted p-[3px]">
        <Skeleton className="h-[calc(100%-1px)] w-24 rounded-md" />
        <Skeleton className="h-[calc(100%-1px)] w-24 rounded-md" />
      </div>
    )}
    <div
      className="flex h-min w-full items-center justify-between self-start px-8"
      data-heading
    >
      <div className="w-full space-y-2 justify-self-stretch">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      {showActions && (
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-10 w-20" />
        </div>
      )}
    </div>
    <Separator />
  </>
);

export { HeadingSkeleton };
