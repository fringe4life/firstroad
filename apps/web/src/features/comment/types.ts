import type {
  CommentGetPayload,
  CommentModel,
} from "@firstroad/db/client-types";
import type { ReactNode, RefObject } from "react";
import type {
  CreateAttachmentAction,
  UIAttachment,
} from "@/features/attachments/types";
import type { Id, Maybe } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type {
  CreateAttachmentsForOwnerInput,
  DeleteAttachmentForOwnerInput,
} from "../attachments/utils/attachment-dal";
import type { UserVerifiable } from "../auth/types";
import type { OrganisationId } from "../organisation/types";
import type { PaginatedResult } from "../pagination/types";

export type CreateCommentAttachmentsInput = Omit<
  CreateAttachmentsForOwnerInput,
  "ownerKind" | "ownerId"
> & {
  commentId: string;
};

export type DeleteCommentAttachmentInput = Omit<
  DeleteAttachmentForOwnerInput,
  "ownerKind" | "ownerId"
> & {
  commentId: string;
};

export interface VerifyComment
  extends UserVerifiable,
    Id,
    OrganisationId,
    Pick<CommentModel, "ticketId"> {}

type CommentModelWithUserInfo = CommentGetPayload<{
  include: { user: { select: { name: true } } };
}>;

// Comment type with additional properties for UI
export type Comment = CommentModelWithUserInfo & {
  isDeleting?: boolean;
  attachments?: UIAttachment[];
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
  commentId?: string;
  initialContent?: Exclude<Maybe<string>, null>;
  onCancel?: () => void;
  onSuccessState?: (state: ActionState<CommentWithUserInfo>) => void;
  state: ActionState<CommentWithUserInfo>;
}

export interface CommentItemProps {
  buttons?: ReactNode;
  comment: Comment;
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
    CommentDeleteHandler {
  canDelete?: boolean;
  canUpdate?: boolean;
  createAttachmentAction?: CreateAttachmentAction;
}

export interface CommentEditButtonProps
  extends CommentContentProps,
    CommentEditHandler {}

export interface CommentActions {
  createAttachmentAction: CreateAttachmentAction;
  deleteCommentAction: (commentId: string) => Promise<ActionState<string>>;
  loadMoreAction: (
    ticketSlug: string,
    cursor?: string,
    take?: number,
    organizationId?: string,
    userId?: string,
  ) => Promise<PaginatedResult<CommentWithUserInfo>>;
  loadMoreOrganizationId?: string;
  loadMoreUserId?: string;
  upsertCommentAction: (
    commentId: Exclude<Maybe<string>, null>,
    ticketId: string,
    _state: ActionState<CommentWithUserInfo>,
    formData: FormData,
  ) => Promise<ActionState<CommentWithUserInfo>>;
}

export interface CommentsProviderProps
  extends CommentActions,
    PaginatedResult<Comment> {
  canCreate?: boolean;
  canDelete?: boolean;
  /** Org-level COMMENT permission for current user's own comments (fallback when item lacks canUpdate/canDelete, e.g. optimistic) */
  canUpdate?: boolean;
  children: ReactNode;
  ticketId: string;
  ticketSlug: string;
  userId?: string;
  userName?: string;
}

export type CommentsProps = Omit<CommentsProviderProps, "children">;

export interface CommentsContextValue {
  canCreate?: boolean;
  canDelete?: boolean;
  /** Org-level COMMENT permission for own comments (fallback when item lacks canUpdate/canDelete) */
  canUpdate?: boolean;
  createAttachmentAction: CreateAttachmentAction;
  editingState: EditingState;
  formRef: RefObject<HTMLDivElement | null>;
  handleCancelEdit: () => void;
  handleDelete: (commentId: string) => Promise<ActionState<string>>;
  handleEdit: (commentId: string, content: string) => void;
  handleLoadMore: () => void;
  handleUpsertSuccess: (state: ActionState<CommentWithUserInfo>) => void;
  hasNextPage: boolean;
  isPending: boolean;
  optimisticComments: CommentWithUserInfo[];
  upsertAction: (formData: FormData) => void;
  upsertState: ActionState<CommentWithUserInfo>;
  userId?: string;
}
