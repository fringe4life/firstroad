import type { AttachmentModel } from "@/generated/prisma/models";
import type { List } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { IsOwner } from "../auth/types";

export interface AttachmentRecord extends AttachmentModel {}

export interface AttachmentWithUrl extends AttachmentRecord {
  downloadUrl: string;
}

export interface AttachmentsProps extends IsOwner {
  ticketId: string;
  attachments: List<AttachmentWithUrl>;
  createAttachmentAction: (
    ticketId: string,
    _state: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}
