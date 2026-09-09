"use cache";

import { orm } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { AttachmentRecord } from "@/features/attachments/types";
import type { List } from "@/types";
import { attachmentsForCommentCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";

const getAttachmentsByComment = async (
  commentId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(attachmentsForCommentCache(commentId));

  const { data: rows } = await tryCatch(async () =>
    orm.CommentAttachment.where({ commentId })
      .select("contentType", "id", "name")
      .orderBy((attachment) => attachment.id.asc())
      .all(),
  );

  return rows;
};

export { getAttachmentsByComment };
