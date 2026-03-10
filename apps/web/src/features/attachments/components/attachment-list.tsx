"use client";

import { GenericComponent } from "@/components/generic-component";
import { AttachmentItem } from "@/features/attachments/components/attachment-item";
import type { AttachmentListProps } from "../types";

const AttachmentList = ({
  attachments,
  isOwner,
  ownerId,
  deleteAttachmentAction,
  onClientAttachmentDeleted,
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
      onClientAttachmentDeleted,
    })}
  />
);

export { AttachmentList };
