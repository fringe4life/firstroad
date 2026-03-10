import type { AttachmentPreview } from "../types";

/** Revoke object URLs for image previews so they can be garbage-collected. */
const revokeImagePreviews = (previews: AttachmentPreview[]): void => {
  for (const preview of previews) {
    if (preview.kind === "image") {
      URL.revokeObjectURL(preview.objectUrl);
    }
  }
};

export { revokeImagePreviews };
