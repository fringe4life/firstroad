import type { ResourcePermission } from "@/features/memberships/types";
import type { CommentListPayload, CommentWithUserInfo } from "../types";

const toCommentListPayload = (
  comment: CommentWithUserInfo & Partial<ResourcePermission>,
): CommentListPayload => ({
  attachments: comment.attachments,
  canDelete: comment.canDelete,
  canUpdate: comment.canUpdate,
  content: comment.content,
  createdAt: comment.createdAt,
  id: comment.id,
  ticketId: comment.ticketId,
  updatedAt: comment.updatedAt,
  user: comment.user,
  userId: comment.userId,
});

export { toCommentListPayload };
