import { CardHeaderSkeleton } from "@/components/card-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AttachmentFormSkeleton } from "./attachment-form-skeleton";
import { AttachmentListSkeleton } from "./attachment-list-skeleton";

const AttachmentsSkeleton = () => (
  <Card>
    <CardHeaderSkeleton />
    <CardContent>
      <div className="grid grid-rows-[1fr_min-content] gap-y-4">
        <AttachmentListSkeleton />
        <AttachmentFormSkeleton />
      </div>
    </CardContent>
  </Card>
);

export { AttachmentsSkeleton };
