"use client";

import { GenericComponent } from "@/components/generic-component";
import { AttachmentItem } from "@/features/attachments/components/attachment-item";
import type { AttachmentListProps, UIAttachment } from "../types";

const AttachmentList = ({
  attachments,
  isOwner,
  ownerId,
  deleteAttachmentAction,
  onClientAttachmentDeleted,
}: AttachmentListProps) => {
  const renderProps = (item: UIAttachment) => ({
    attachment: item,
    deleteAttachmentAction,
    isOwner,
    onClientAttachmentDeleted,
    ownerId,
  });

  return (
    <GenericComponent
      as="ul"
      Component={AttachmentItem}
      className="grid gap-y-2"
      emptyStateMessage="No attachments yet."
      errorStateMessage="Failed to load attachments"
      items={attachments}
      renderProps={renderProps}
    />
  );
};

export { AttachmentList };
