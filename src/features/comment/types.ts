import type { CommentGetPayload } from "@/generated/prisma/models/Comment";
import type { Maybe } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { PaginatedResult } from "../pagination/types";

type CommentModelWithUserInfo = CommentGetPayload<{
  include: { user: { select: { name: true } } };
}>;

// Comment type with additional properties for UI
export type Comment = CommentModelWithUserInfo & {
  isDeleting?: boolean;
};

// Comment type with required user info (for actions)
export type CommentWithUserInfo = Comment;

export interface Time {
  createdAt: string;
  updatedAt: string;
}

export interface EditingState {
  commentId: Exclude<Maybe<string>, null>;
  content: Exclude<Maybe<string>, null>;
}

export interface CommentState {
  list: NonNullable<PaginatedResult<CommentWithUserInfo>["list"]>;
  metadata: PaginatedResult<CommentWithUserInfo>["metadata"];
}

export interface CommentOwnerButtonsProps {
  comment: Pick<Comment, "id" | "content">;
  onEdit: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => Promise<ActionState<string>>;
}

export interface CommentEditButtonProps {
  comment: Pick<Comment, "id" | "content">;
  onEdit: (commentId: string, content: string) => void;
}
