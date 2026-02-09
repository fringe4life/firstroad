"use client";

import { GenericComponent } from "@/components/generic-component";
import { AttachmentItem } from "@/features/attachments/components/attachment-item";
import type { List } from "@/types";
import type { DeleteAttachmentAction, UIAttachment } from "../types";

interface AttachmentListProps {
  attachments: List<UIAttachment>;
  isOwner: boolean;
  ownerId: string;
  deleteAttachmentAction: DeleteAttachmentAction;
}

const AttachmentList = ({
  attachments,
  isOwner,
  ownerId,
  deleteAttachmentAction,
}: AttachmentListProps) => (
  <GenericComponent
    as="ul"
    Component={AttachmentItem}
    className="grid gap-y-2"
    emptyStateMessage="No attachments yet."
    errorStateMessage="Failed to load attachments"
    items={attachments}
    renderProps={(item) => ({
      attachment: item,
      isOwner,
      ownerId,
      deleteAttachmentAction,
    })}
  />
);

export { AttachmentList };
