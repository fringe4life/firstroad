import { CardCompact } from "@/components/card-compact";
import { AttachmentCreateForm } from "@/features/attachments/components/attachment-create-form";
import { AttachmentList } from "@/features/attachments/components/attachment-list";
import type { AttachmentsProps } from "@/features/attachments/types";

const Attachments = ({
  ticketId,
  isOwner,
  attachments,
  createAttachmentAction,
}: AttachmentsProps) => (
  <CardCompact
    content={
      <div className="grid grid-rows-[1fr_min-content] gap-y-4">
        <AttachmentList attachments={attachments} />
        {isOwner && (
          <AttachmentCreateForm
            createAttachmentAction={createAttachmentAction}
            ticketId={ticketId}
          />
        )}
      </div>
    }
    description="Upload files for this ticket"
    title="Add attachment"
  />
);

export { Attachments };
