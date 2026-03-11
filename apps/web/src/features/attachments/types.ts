import type { ResourceType } from "@/features/memberships/types";
import type { Id, List, Maybe } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { IsOwner } from "../auth/types";
import type { OrganisationId } from "../organisation/types";

export type Mime = `${string}/${string}`;
export interface OwnerId {
  ownerId: string;
}

export interface AttachmentRecord extends Id {
  contentType: string;
  name: string;
}

export interface AttachmentWithUrl extends AttachmentRecord {
  downloadUrl: Maybe<string>;
}

export interface UIAttachment extends AttachmentWithUrl {}

export type OwnerKind = Lowercase<ResourceType>;

export interface AttachmentDeleteArgs extends OwnerId {
  attachmentId: string;
}

/**
 * Attachment mutation payloads
 *
 * These payloads are intentionally attachment-centric. They provide enough
 * information for clients (eg. CommentsProvider) to update local state
 * without requiring full ticket/comment models.
 */
export interface AttachmentCreatedPayload {
  created: UIAttachment[];
  item: VerifiableItem;
}

export interface AttachmentDeletedPayload {
  deletedAttachmentId: string;
  item: VerifiableItem;
}

/** Type guard: narrows state to CLIENT response with payload (for use in forms that receive union of CLIENT/SERVER-bound actions). */
export const hasAttachmentCreatedPayload = (
  state: ActionState<AttachmentCreatedPayload | unknown>,
): state is ActionState<AttachmentCreatedPayload> & {
  data: AttachmentCreatedPayload;
} =>
  state.data != null &&
  typeof state.data === "object" &&
  "created" in state.data;

/** Type guard: narrows state to CLIENT response with payload. */
export const hasAttachmentDeletedPayload = (
  state: ActionState<AttachmentDeletedPayload | unknown>,
): state is ActionState<AttachmentDeletedPayload> & {
  data: AttachmentDeletedPayload;
} =>
  state.data != null &&
  typeof state.data === "object" &&
  "deletedAttachmentId" in state.data;

/** Single signature so forms can pass union state; use type guards to narrow return. */
export type DeleteAttachmentAction = (
  args: AttachmentDeleteArgs,
  state: ActionState<AttachmentDeletedPayload | unknown>,
  formData: FormData,
) => Promise<ActionState<AttachmentDeletedPayload> | ActionState<unknown>>;

/** Single signature so forms can pass union state; use type guards to narrow return. */
export type CreateAttachmentAction = (
  ownerId: string,
  state: ActionState<AttachmentCreatedPayload | unknown>,
  formData: FormData,
) => Promise<ActionState<AttachmentCreatedPayload> | ActionState<unknown>>;

export interface AttachmentsProps extends IsOwner, OwnerId {
  attachments: List<UIAttachment>;
  createAttachmentAction: CreateAttachmentAction;
  deleteAttachmentAction: DeleteAttachmentAction;
  onClientAttachmentCreated?: (payload: AttachmentCreatedPayload) => void;
  onClientAttachmentDeleted?: (payload: AttachmentDeletedPayload) => void;
}

interface VerifiableItemBase extends IsOwner, OrganisationId, OwnerId {
  ownerLabel: OwnerKind;
  resourceType: ResourceType;
}

export interface VerifiableTicket extends VerifiableItemBase {
  commentId?: never;
  ownerLabel: "ticket";
  resourceType: "TICKET";
  slug: string;
}

export interface VerifiableComment extends VerifiableItemBase {
  commentId: string;
  ownerLabel: "comment";
  resourceType: "COMMENT";
  slug?: never;
}

export type VerifiableItem = VerifiableTicket | VerifiableComment;

export type AttachmentPreviewKind = "image" | "pdf" | "other";

export interface ImageAttachmentPreview {
  file: File;
  id: string;
  kind: "image";
  objectUrl: string;
}

export interface PdfAttachmentPreview {
  file: File;
  id: string;
  kind: "pdf";
}

export interface OtherAttachmentPreview {
  file: File;
  id: string;
  kind: "other";
}

export type AttachmentPreview =
  | ImageAttachmentPreview
  | PdfAttachmentPreview
  | OtherAttachmentPreview;

export interface AttachmentPreviewProps {
  onRemove: (id: string) => void;
  preview: AttachmentPreview;
}

export interface AttachmentItemProps extends IsOwner, OwnerId {
  attachment: UIAttachment;
  deleteAttachmentAction: DeleteAttachmentAction;
  onClientAttachmentDeleted?: (payload: AttachmentDeletedPayload) => void;
}

export interface AttachmentListProps extends IsOwner, OwnerId {
  attachments: List<UIAttachment>;
  deleteAttachmentAction: DeleteAttachmentAction;
  onClientAttachmentDeleted?: (payload: AttachmentDeletedPayload) => void;
}

export interface AttachmentCreateFormProps extends OwnerId {
  createAttachmentAction: CreateAttachmentAction;
  onClientAttachmentCreated?: (payload: AttachmentCreatedPayload) => void;
  onSuccess?: () => void;
}

export interface AttachmentInputWithPreviewsRef {
  reset: () => void;
}

export interface AttachmentInputWithPreviewsProps {
  disabled?: boolean;
  fileInputId?: string;
  label?: string;
  name?: string;
  onPreviewsChange?: (count: number) => void;
}
