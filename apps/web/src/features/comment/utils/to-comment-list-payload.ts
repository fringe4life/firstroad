import type { ResourcePermission } from "@/features/memberships/types";
import type { CommentListPayload, CommentWithUserInfo } from "../types";

const toCommentListPayload = (
  comment: CommentWithUserInfo & Partial<ResourcePermission>,
): CommentListPayload => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  userId: comment.userId,
  user: comment.user,
  attachments: comment.attachments,
  ticketId: comment.ticketId,
  canUpdate: comment.canUpdate,
  canDelete: comment.canDelete,
  canCreate: comment.canCreate,
});
export { toCommentListPayload };
