"use server";

import type { AttachmentRecord } from "@/features/attachments/types";
import { createAttachmentsForOwner } from "@/features/attachments/utils/attachment-dal";
import type { List } from "@/types";
import type { CreateCommentAttachmentsInput } from "../types";

const createCommentAttachments = async ({
  organizationId,
  commentId,
  files,
}: CreateCommentAttachmentsInput): Promise<List<AttachmentRecord>> =>
  createAttachmentsForOwner({
    ownerKind: "comment",
    organizationId,
    ownerId: commentId,
    files,
  });

export { createCommentAttachments };
