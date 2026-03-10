"use server";

import { refresh } from "next/cache";
import { safeParse, ValiError } from "valibot";
import { getUser } from "@/features/auth/queries/get-user";
import type { ResourceType } from "@/features/memberships/types";
import {
  invalidateAttachmentsForComment,
  invalidateTicketAndAttachments,
} from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { deleteAttachmentInputSchema } from "../schemas";
import type { AttachmentDeletedPayload } from "../types";
import { deleteAttachmentForOwner } from "../utils/attachment-dal";
import { getVerifiableItem } from "../utils/get-verifiable-item";
import { toOwnerKind } from "../utils/to-owner-kind";

interface DeleteAttachmentArgs {
  attachmentId: string;
  ownerId: string;
}

const deleteAttachmentImpl = async (
  updateBoundary: "CLIENT" | "SERVER",
  resourceType: ResourceType,
  { attachmentId, ownerId }: DeleteAttachmentArgs,
  _prevState: ActionState<AttachmentDeletedPayload | unknown>,
  _formData: FormData,
): Promise<ActionState<AttachmentDeletedPayload> | ActionState<unknown>> => {
  const parseResult = safeParse(deleteAttachmentInputSchema, {
    attachmentId,
    ownerId,
  });

  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }

  const { user } = await getUser();
  if (!user?.id) {
    return toActionState(
      "You must be signed in to delete attachments",
      "ERROR",
    );
  }

  const item = await getVerifiableItem(resourceType, ownerId, user);
  if (!item) {
    const label = resourceType === "TICKET" ? "Ticket" : "Comment";
    return toActionState(`${label} not found`, "ERROR");
  }
  if (!item.isOwner) {
    return toActionState(
      `Only the ${item.ownerLabel} owner can delete attachments`,
      "ERROR",
    );
  }

  const ownerKind = toOwnerKind(resourceType);
  const { error } = await tryCatch(() =>
    deleteAttachmentForOwner({
      ownerKind,
      organizationId: item.organizationId,
      ownerId,
      attachmentId,
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  switch (item.resourceType) {
    case "TICKET":
      invalidateTicketAndAttachments(item.slug, ownerId);
      break;
    case "COMMENT":
      invalidateAttachmentsForComment(item.commentId);
      break;
    default:
      break;
  }

  const payload: AttachmentDeletedPayload = {
    item,
    deletedAttachmentId: attachmentId,
  };

  if (updateBoundary === "SERVER") {
    refresh();
    return toActionState("Attachment deleted", "SUCCESS");
  }
  return toActionState("Attachment deleted", "SUCCESS", undefined, payload);
};

async function deleteAttachment(
  updateBoundary: "CLIENT",
  resourceType: ResourceType,
  args: DeleteAttachmentArgs,
  _prevState: ActionState<AttachmentDeletedPayload>,
  _formData: FormData,
): Promise<ActionState<AttachmentDeletedPayload>>;
async function deleteAttachment(
  updateBoundary: "SERVER",
  resourceType: ResourceType,
  args: DeleteAttachmentArgs,
  _prevState: ActionState<unknown>,
  _formData: FormData,
): Promise<ActionState<unknown>>;
async function deleteAttachment(
  updateBoundary: "CLIENT" | "SERVER",
  resourceType: ResourceType,
  args: DeleteAttachmentArgs,
  _prevState: ActionState<AttachmentDeletedPayload | unknown>,
  _formData: FormData,
): Promise<ActionState<AttachmentDeletedPayload> | ActionState<unknown>> {
  return await deleteAttachmentImpl(
    updateBoundary,
    resourceType,
    args,
    _prevState,
    _formData,
  );
}

export { deleteAttachment };
