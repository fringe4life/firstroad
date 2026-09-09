"use server";

import { orm } from "@firstroad/db";
import { s3 } from "bun";
import type { OrganisationId } from "@/features/organisation/types";
import type { List } from "@/types";
import type { AttachmentRecord, OwnerId, OwnerKind } from "../types";
import { attachmentS3Key } from "./presign-attachments";

interface CreateAttachmentsForOwnerInput extends OwnerId, OrganisationId {
  files: Array<{
    file: File;
    contentType: string;
  }>;
  ownerKind: OwnerKind;
}

interface DeleteAttachmentForOwnerInput extends OwnerId, OrganisationId {
  attachmentId: string;
  ownerKind: OwnerKind;
}

/**
 * Low-level DAL helpers for ticket & comment attachments.
 *
 * These functions hide the fact that attachments are stored in two separate
 * models (TicketAttachment, CommentAttachment) and provide a single
 * API based on OwnerKind + ownerId. They are used by feature-specific DAL
 * entrypoints in `features/ticket/dal` and `features/comment/dal`, and are
 * intentionally unaware of auth, validation, or cache invalidation.
 */
const createAttachmentsForOwner = async ({
  ownerKind,
  organizationId,
  ownerId,
  files,
}: CreateAttachmentsForOwnerInput): Promise<List<AttachmentRecord>> => {
  if (files.length === 0) {
    return [];
  }

  const attachments: List<AttachmentRecord> = await Promise.all(
    files.map(({ file, contentType }) => {
      switch (ownerKind) {
        case "ticket":
          return orm.TicketAttachment.select(
            "contentType",
            "id",
            "name",
          ).create({
            contentType,
            name: file.name,
            ticketId: ownerId,
          });
        case "comment":
          return orm.CommentAttachment.select(
            "contentType",
            "id",
            "name",
          ).create({
            commentId: ownerId,
            contentType,
            name: file.name,
          });
        default:
          throw new Error(`Invalid owner kind: ${ownerKind}`) as never;
      }
    }),
  );

  await Promise.all(
    attachments.map(async (attachment, index) => {
      const { file } = files[index];
      const key = attachmentS3Key(
        organizationId,
        ownerKind,
        ownerId,
        attachment.id,
        attachment.name,
      );
      const data = await file.arrayBuffer();
      await s3.file(key).write(data);
    }),
  );

  return attachments;
};

const deleteAttachmentForOwner = async ({
  ownerKind,
  organizationId,
  ownerId,
  attachmentId,
}: DeleteAttachmentForOwnerInput): Promise<void> => {
  const attachment =
    ownerKind === "ticket"
      ? await orm.TicketAttachment.where({
          id: attachmentId,
          ticketId: ownerId,
        }).first()
      : await orm.CommentAttachment.where({
          commentId: ownerId,
          id: attachmentId,
        }).first();

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  const key = attachmentS3Key(
    organizationId,
    ownerKind,
    ownerId,
    attachment.id,
    attachment.name,
  );

  try {
    await s3.file(key).delete();
  } catch (error) {
    throw new Error("Could not delete attachment from storage", {
      cause: error,
    });
  }

  try {
    if (ownerKind === "ticket") {
      await orm.TicketAttachment.where({ id: attachment.id }).delete();
    } else {
      await orm.CommentAttachment.where({ id: attachment.id }).delete();
    }
  } catch (error) {
    throw new Error("Attachment removed from storage but not from database", {
      cause: error,
    });
  }
};

export {
  type CreateAttachmentsForOwnerInput,
  createAttachmentsForOwner,
  type DeleteAttachmentForOwnerInput,
  deleteAttachmentForOwner,
};
