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
import type { AttachmentCreatedPayload } from "../types";
import { createAttachmentsForOwner } from "../utils/attachment-dal";
import { filesWithContentType } from "../utils/files-with-content-type";
import { getVerifiableItem } from "../utils/get-verifiable-item";
import { presignAttachments } from "../utils/presign-attachments";
import { toOwnerKind } from "../utils/to-owner-kind";

const createAttachmentImpl = async (
  updateBoundary: "CLIENT" | "SERVER",
  resourceType: ResourceType,
  ownerId: string,
  _state: ActionState<AttachmentCreatedPayload | unknown>,
  formData: FormData,
): Promise<ActionState<AttachmentCreatedPayload> | ActionState<unknown>> => {
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
    return toActionState(`${resourceType} not found`, "ERROR");
  }
  if (!item.isOwner) {
    return toActionState(
      `Only the ${item.ownerLabel} owner can add attachments`,
      "ERROR",
    );
  }

  const ownerKind = toOwnerKind(resourceType);

  const { data: createdRecords, error } = await tryCatch(() =>
    createAttachmentsForOwner({
      ownerKind,
      organizationId: item.organizationId,
      ownerId,
      files: filesWithContentType(validatedFiles),
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
      throw new Error("Invalid resource type") as never;
  }

  if (updateBoundary === "SERVER") {
    refresh();
    return toActionState("Attachment(s) uploaded", "SUCCESS");
  }

  // Build payload only for CLIENT boundary so clients can update local state without a full refresh.
  let payload: AttachmentCreatedPayload | undefined;
  if (createdRecords && createdRecords.length > 0) {
    const withUrls = presignAttachments(
      item.organizationId,
      ownerKind,
      ownerId,
      createdRecords,
    );
    payload = {
      item,
      created: withUrls ?? [],
    };
  }
  return toActionState("Attachment(s) uploaded", "SUCCESS", undefined, payload);
};

async function createAttachment(
  updateBoundary: "CLIENT",
  resourceType: ResourceType,
  ownerId: string,
  _state: ActionState<AttachmentCreatedPayload>,
  formData: FormData,
): Promise<ActionState<AttachmentCreatedPayload>>;
async function createAttachment(
  updateBoundary: "SERVER",
  resourceType: ResourceType,
  ownerId: string,
  _state: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>>;
async function createAttachment(
  updateBoundary: "CLIENT" | "SERVER",
  resourceType: ResourceType,
  ownerId: string,
  _state: ActionState<AttachmentCreatedPayload | unknown>,
  formData: FormData,
): Promise<ActionState<AttachmentCreatedPayload> | ActionState<unknown>> {
  return await createAttachmentImpl(
    updateBoundary,
    resourceType,
    ownerId,
    _state,
    formData,
  );
}

export { createAttachment };
