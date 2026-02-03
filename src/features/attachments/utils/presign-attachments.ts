import type { List } from "@/types";
import type { AttachmentRecord, AttachmentWithUrl } from "../types";

const PRESIGN_EXPIRES_IN_SECONDS = 3600; // 1 hour

const attachmentS3Key = (
  ticketId: string,
  attachmentId: string,
  name: string,
) => `attachments/${ticketId}/${attachmentId}/${name}`;

/**
 * Presign download URLs for attachments using Bun.s3.
 * Only runs when Bun runtime is available; on Node (e.g. Vercel) returns attachments with empty downloadUrl.
 */
const presignAttachments = (
  ticketId: string,
  attachments: List<AttachmentRecord>,
): List<AttachmentWithUrl> => {
  if (!attachments) {
    return undefined;
  }
  if (typeof globalThis.Bun === "undefined" || !("s3" in globalThis.Bun)) {
    return attachments.map((a) => ({ ...a, downloadUrl: "" }));
  }

  const s3 = (
    globalThis.Bun as {
      s3: {
        file: (key: string) => {
          presign: (opts?: { expiresIn?: number }) => string;
        };
      };
    }
  ).s3;
  return attachments.map((a) => {
    const key = attachmentS3Key(ticketId, a.id, a.name);
    const downloadUrl = s3.file(key).presign({
      expiresIn: PRESIGN_EXPIRES_IN_SECONDS,
    });
    return { ...a, downloadUrl };
  });
};

export { attachmentS3Key, presignAttachments };
