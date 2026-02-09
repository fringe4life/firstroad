import { s3 } from "bun";
import type { List } from "@/types";
import type { AttachmentRecord, AttachmentWithUrl, OwnerKind } from "../types";

const PRESIGN_EXPIRES_IN_SECONDS = 3600; // 1 hour

const attachmentS3Key = (
  organizationId: string,
  ownerKind: OwnerKind,
  ownerId: string,
  attachmentId: string,
  name: string,
): string =>
  `${organizationId}/${ownerKind}/${ownerId}/${name}-${attachmentId}`;

/**
 * Presign download URLs for attachments using Bun.s3.
 * Only runs when Bun runtime is available; on Node (e.g. Vercel) returns attachments with empty downloadUrl.
 */
const presignAttachments = (
  organizationId: string,
  ownerKind: OwnerKind,
  ownerId: string,
  attachments: List<AttachmentRecord>,
): List<AttachmentWithUrl> => {
  if (!attachments) {
    return undefined;
  }

  return attachments.map((attachment) => {
    const key = attachmentS3Key(
      organizationId,
      ownerKind,
      ownerId,
      attachment.id,
      attachment.name,
    );
    const downloadUrl = s3.file(key).presign({
      expiresIn: PRESIGN_EXPIRES_IN_SECONDS,
      // Force a clean, user‑friendly download filename
      contentDisposition: `attachment; filename="${attachment.name}"`,
    });
    return { ...attachment, downloadUrl };
  });
};

export { attachmentS3Key, presignAttachments };
