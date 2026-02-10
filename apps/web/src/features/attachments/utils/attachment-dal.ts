"use server";

import { prisma } from "@firstroad/db";
import { s3 } from "bun";
import type { List } from "@/types";
import type { AttachmentRecord, OwnerKind } from "../types";
import { attachmentS3Key } from "./presign-attachments";

interface CreateAttachmentsForOwnerInput {
  ownerKind: OwnerKind;
  organizationId: string;
  ownerId: string;
  files: File[];
}

interface DeleteAttachmentForOwnerInput {
  ownerKind: OwnerKind;
  organizationId: string;
  ownerId: string;
  attachmentId: string;
}

/**
 * Low-level DAL helpers for ticket & comment attachments.
 *
 * These functions hide the fact that attachments are stored in two separate
 * Prisma models (TicketAttachment, CommentAttachment) and provide a single
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
  if (!files?.length) {
    return [];
  }

  // Create all attachment rows in parallel (one DB round-trip wave)
  const attachments: List<AttachmentRecord> = await Promise.all(
    files.map((file) => {
      if (ownerKind === "ticket") {
        return prisma.ticketAttachment.create({
          data: { name: file.name, ticketId: ownerId },
          select: { id: true, name: true },
        });
      }

      return prisma.commentAttachment.create({
        data: { name: file.name, commentId: ownerId },
        select: { id: true, name: true },
      });
    }),
  );

  // Upload all files to S3 in parallel (one wave of concurrent writes)
  await Promise.all(
    attachments.map(async (attachment, index) => {
      const file = files[index];
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
      ? await prisma.ticketAttachment.findFirst({
          where: { id: attachmentId, ticketId: ownerId },
        })
      : await prisma.commentAttachment.findFirst({
          where: { id: attachmentId, commentId: ownerId },
        });

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
  } catch {
    throw new Error("Could not delete attachment from storage");
  }

  try {
    if (ownerKind === "ticket") {
      await prisma.ticketAttachment.delete({
        where: { id: attachment.id },
      });
    } else {
      await prisma.commentAttachment.delete({
        where: { id: attachment.id },
      });
    }
  } catch {
    throw new Error("Attachment removed from storage but not from database");
  }
};

export {
  createAttachmentsForOwner,
  deleteAttachmentForOwner,
  type CreateAttachmentsForOwnerInput,
  type DeleteAttachmentForOwnerInput,
};
