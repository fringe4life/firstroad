import { s3 } from "bun";
import type { List } from "@/types";
import type { AttachmentRecord, AttachmentWithUrl } from "../types";

const PRESIGN_EXPIRES_IN_SECONDS = 3600; // 1 hour

const attachmentS3Key = (
  organizationId: string,
  ticketId: string,
  attachmentId: string,
  name: string,
): string => `${organizationId}/${ticketId}/${name}-${attachmentId}`;

/**
 * Presign download URLs for attachments using Bun.s3.
 * Only runs when Bun runtime is available; on Node (e.g. Vercel) returns attachments with empty downloadUrl.
 */
const presignAttachments = (
  organizationId: string,
  ticketId: string,
  attachments: List<AttachmentRecord>,
): List<AttachmentWithUrl> => {
  if (!attachments) {
    return undefined;
  }

  return attachments.map((a) => {
    const key = attachmentS3Key(organizationId, ticketId, a.id, a.name);
    const downloadUrl = s3.file(key).presign({
      expiresIn: PRESIGN_EXPIRES_IN_SECONDS,
      // Force a clean, user‑friendly download filename
      contentDisposition: `attachment; filename="${a.name}"`,
    });
    return { ...a, downloadUrl };
  });
};

export { attachmentS3Key, presignAttachments };
