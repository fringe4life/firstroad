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
import { deleteAttachmentForOwner } from "../utils/attachment-dal";
import { getVerifiableItem } from "../utils/get-verifiable-item";
import { toOwnerKind } from "../utils/to-owner-kind";

interface DeleteAttachmentArgs {
  attachmentId: string;
  ownerId: string;
}

const deleteAttachment = async (
  resourceType: ResourceType,
  { attachmentId, ownerId }: DeleteAttachmentArgs,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> => {
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

  const { error } = await tryCatch(() =>
    deleteAttachmentForOwner({
      ownerKind: toOwnerKind(resourceType),
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

  refresh();
  return toActionState("Attachment deleted", "SUCCESS");
};

export { deleteAttachment };
