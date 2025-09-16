import type { IsOwner } from "@/features/auth/utils/owner";
import type { CommentGetPayload } from "@/generated/prisma/models/Comment";

type CommentModelWithUserInfo = CommentGetPayload<{
  include: { userInfo: { include: { user: { select: { name: true } } } } };
}>;

// Comment type with additional properties for UI
export type Comment = CommentModelWithUserInfo &
  IsOwner & {
    isDeleting?: boolean;
  };

// Comment type with required user info (for actions)
export type CommentWithUserInfo = Comment;
