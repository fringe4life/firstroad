import type { Id, List } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { IsOwner } from "../auth/types";

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

export type OwnerKind = "ticket" | "comment";

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
