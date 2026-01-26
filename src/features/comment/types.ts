import type { ReactNode, RefObject } from "react";
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

export interface CommentCreateFormProps {
  action: (formData: FormData) => void;
  state: ActionState<CommentWithUserInfo>;
  commentId?: string;
  initialContent?: Exclude<Maybe<string>, null>;
  onCancel?: () => void;
  onSuccessState?: (state: ActionState<CommentWithUserInfo>) => void;
}

export interface CommentItemProps {
  comment: Comment;
  buttons?: ReactNode;
}

export interface CommentContentProps {
  comment: Pick<Comment, "id" | "content">;
}

export interface CommentEditHandler {
  onEdit: (commentId: string, content: string) => void;
}

export interface CommentDeleteHandler {
  onDeleteComment: (commentId: string) => Promise<ActionState<string>>;
}

export interface CommentDeleteButtonProps extends CommentDeleteHandler {
  id: string;
}

export interface CommentOwnerButtonsProps
  extends CommentContentProps,
    CommentEditHandler,
    CommentDeleteHandler {}

export interface CommentEditButtonProps
  extends CommentContentProps,
    CommentEditHandler {}

export interface CommentActions {
  loadMoreAction: (
    ticketSlug: string,
    cursor?: string,
    take?: number,
  ) => Promise<PaginatedResult<CommentWithUserInfo>>;
  upsertCommentAction: (
    commentId: Exclude<Maybe<string>, null>,
    ticketId: string,
    _state: ActionState<CommentWithUserInfo>,
    formData: FormData,
  ) => Promise<ActionState<CommentWithUserInfo>>;
  deleteCommentAction: (commentId: string) => Promise<ActionState<string>>;
}

export interface CommentsProviderProps
  extends CommentActions,
    PaginatedResult<Comment> {
  ticketSlug: string;
  ticketId: string;
  userId?: string;
  userName?: string;
  children: ReactNode;
}

export type CommentsProps = Omit<CommentsProviderProps, "children">;

export interface CommentsContextValue {
  formRef: RefObject<HTMLDivElement | null>;
  optimisticComments: CommentWithUserInfo[];
  editingState: EditingState;
  upsertState: ActionState<CommentWithUserInfo>;
  upsertAction: (formData: FormData) => void;
  userId?: string;
  isPending: boolean;
  hasNextPage: boolean;
  handleUpsertSuccess: (state: ActionState<CommentWithUserInfo>) => void;
  handleEdit: (commentId: string, content: string) => void;
  handleCancelEdit: () => void;
  handleLoadMore: () => void;
  handleDelete: (commentId: string) => Promise<ActionState<string>>;
}
