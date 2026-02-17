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
import { filesSchema } from "../schemas";
import { createAttachmentsForOwner } from "../utils/attachment-dal";
import { getVerifiableItem } from "../utils/get-verifiable-item";
import { toOwnerKind } from "../utils/to-owner-kind";

const createAttachment = async (
  resourceType: ResourceType,
  ownerId: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const files = Array.from(formData.getAll("files"));

  const parseResult = safeParse(filesSchema, files);
  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }
  const validatedFiles = parseResult.output;

  const { user } = await getUser();
  if (!user?.id) {
    return toActionState(
      "You must be signed in to upload attachments",
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
      `Only the ${item.ownerLabel} owner can add attachments`,
      "ERROR",
    );
  }

  const { error } = await tryCatch(() =>
    createAttachmentsForOwner({
      ownerKind: toOwnerKind(resourceType),
      organizationId: item.organizationId,
      ownerId,
      files: validatedFiles,
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
  return toActionState("Attachment(s) uploaded", "SUCCESS");
};

export { createAttachment };
