"use server";

import { deleteAttachmentForOwner } from "@/features/attachments/utils/attachment-dal";
import type { DeleteCommentAttachmentInput } from "../types";

const deleteCommentAttachmentRecord = async ({
  organizationId,
  commentId,
  attachmentId,
}: DeleteCommentAttachmentInput): Promise<void> =>
  deleteAttachmentForOwner({
    ownerKind: "comment",
    organizationId,
    ownerId: commentId,
    attachmentId,
  });

export { deleteCommentAttachmentRecord };
