import type { ResourceType } from "@/features/memberships/types";
import type { Id, List } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { IsOwner } from "../auth/types";
import type { OrganisationId } from "../organisation/types";

export interface OwnerId {
  ownerId: string;
}

export interface AttachmentRecord extends Id {
  name: string;
}

export interface AttachmentWithUrl extends AttachmentRecord {
  downloadUrl: string | null;
}

export interface UIAttachment extends AttachmentWithUrl {}

export type OwnerKind = Lowercase<ResourceType>;

export interface AttachmentDeleteArgs extends OwnerId {
  attachmentId: string;
}

export type DeleteAttachmentAction = (
  args: AttachmentDeleteArgs,
  state: ActionState,
  formData: FormData,
) => Promise<ActionState>;

export type CreateAttachmentAction = (
  ownerId: string,
  state: ActionState,
  formData: FormData,
) => Promise<ActionState>;

export interface AttachmentsProps extends IsOwner, OwnerId {
  attachments: List<UIAttachment>;
  createAttachmentAction: CreateAttachmentAction;
  deleteAttachmentAction: DeleteAttachmentAction;
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
