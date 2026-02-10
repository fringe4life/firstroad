import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttachmentListSkeleton } from "@/features/attachments/components/skeletons/attachment-list-skeleton";

const CommentItemSkeleton = () => {
  return (
    <div className="flex gap-2">
      <Card className="max-content-narrow gap-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="grid gap-1">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
          <AttachmentListSkeleton />
        </CardContent>
      </Card>
      <div className="flex flex-col gap-1">
        <IconButtonSkeleton />
      </div>
    </div>
  );
};

export { CommentItemSkeleton };
