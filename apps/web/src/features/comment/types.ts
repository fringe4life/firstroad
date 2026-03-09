import type {
  CommentGetPayload,
  CommentModel,
} from "@firstroad/db/client-types";
import type { ReactNode, RefObject } from "react";
import type {
  AttachmentCreatedPayload,
  AttachmentDeletedPayload,
  CreateAttachmentAction,
  DeleteAttachmentAction,
  UIAttachment,
} from "@/features/attachments/types";
import type { Id, List, Maybe } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { UserVerifiable } from "../auth/types";
import type { ResourcePermission } from "../memberships/types";
import type { OrganisationId } from "../organisation/types";
import type { PaginatedResult } from "../pagination/types";

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

/**
 * Minimal comment shape sent from server to Comments client (RSC boundary).
 * Omits ticket relation and other fields not used by CommentItem / comments-store.
 * Includes ticketId so the payload is assignable to CommentWithUserInfo (state/load-more).
 */
export type CommentListPayload = Pick<
  Omit<CommentWithUserInfo, "ticket">,
  | "id"
  | "content"
  | "createdAt"
  | "updatedAt"
  | "userId"
  | "user"
  | "attachments"
  | "ticketId"
> &
  Partial<Pick<ResourcePermission, "canUpdate" | "canDelete">>;

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
    CommentDeleteHandler,
    Partial<Pick<ResourcePermission, "canDelete" | "canUpdate">> {
  createAttachmentAction?: CreateAttachmentAction;
  onClientAttachmentCreated?: (payload: AttachmentCreatedPayload) => void;
}

export interface CommentEditButtonProps
  extends CommentContentProps,
    CommentEditHandler {}

export interface CommentActions {
  createAttachmentAction: CreateAttachmentAction;
  deleteAttachmentAction: DeleteAttachmentAction;
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
    Partial<Omit<ResourcePermission, "canUpdate" | "canDelete">>,
    Omit<PaginatedResult<Comment>, "list"> {
  children: ReactNode;
  /** Initial list from server (minimal payload at RSC boundary). */
  list?: List<CommentListPayload>;
  ticketId: string;
  ticketSlug: string;
  userId?: string;
  userName?: string;
}

export type CommentsProps = Omit<CommentsProviderProps, "children">;

type ContextPermission = Partial<
  Omit<ResourcePermission, "canUpdate" | "canDelete">
>;
type ItemPermission = Partial<
  Pick<ResourcePermission, "canUpdate" | "canDelete">
>;

export interface CommentsContextValue extends ContextPermission {
  createAttachmentAction: CreateAttachmentAction;
  deleteAttachmentAction: DeleteAttachmentAction;
  editingState: EditingState;
  formRef: RefObject<HTMLDivElement | null>;
  handleCancelEdit: () => void;
  handleClientAttachmentCreated: (payload: AttachmentCreatedPayload) => void;
  handleClientAttachmentDeleted: (payload: AttachmentDeletedPayload) => void;
  handleDelete: (commentId: string) => Promise<ActionState<string>>;
  handleEdit: (commentId: string, content: string) => void;
  handleLoadMore: () => void;
  handleUpsertSuccess: (state: ActionState<CommentWithUserInfo>) => void;
  hasNextPage: boolean;
  isPending: boolean;
  optimisticComments: Array<CommentWithUserInfo & ItemPermission>;
  upsertAction: (formData: FormData) => void;
  upsertState: ActionState<CommentWithUserInfo>;
  userId?: string;
}
