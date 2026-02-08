"use client";

import { GenericComponent } from "@/components/generic-component";
import { AttachmentItem } from "@/features/attachments/components/attachment-item";
import type { List } from "@/types";
import type { AttachmentWithUrl } from "../types";

interface AttachmentListProps {
  attachments: List<AttachmentWithUrl>;
  isOwner: boolean;
  ticketId: string;
}

const AttachmentList = ({
  attachments,
  isOwner,
  ticketId,
}: AttachmentListProps) => (
  <GenericComponent
    as="ul"
    Component={AttachmentItem}
    className="grid gap-y-2"
    emptyStateMessage="No attachments yet."
    errorStateMessage="Failed to load attachments"
    items={attachments}
    renderProps={(item) => ({ attachment: item, isOwner, ticketId })}
  />
);

export { AttachmentList };
