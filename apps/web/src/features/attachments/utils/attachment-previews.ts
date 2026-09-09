import type { Maybe } from "@/types";
import { SUPPORTED_IMAGE_TYPES } from "../constants";
import type {
  AttachmentPreview,
  ImageAttachmentPreview,
  OtherAttachmentPreview,
  PdfAttachmentPreview,
} from "../types";

const PDF_MIME_TYPE = "application/pdf";

const createAttachmentPreviews = (
  files: Maybe<FileList | File[]>,
): AttachmentPreview[] => {
  if (!files) {
    return [];
  }

  const fileArray = Array.from(files);

  return fileArray.map((file, index) => {
    const id = `${file.name}-${file.lastModified}-${index}`;

    if (SUPPORTED_IMAGE_TYPES.has(file.type)) {
      const imagePreview: ImageAttachmentPreview = {
        file,
        id,
        kind: "image",
        objectUrl: URL.createObjectURL(file),
      };

      return imagePreview;
    }

    if (file.type === PDF_MIME_TYPE) {
      const pdfPreview: PdfAttachmentPreview = {
        file,
        id,
        kind: "pdf",
      };

      return pdfPreview;
    }

    const otherPreview: OtherAttachmentPreview = {
      file,
      id,
      kind: "other",
    };

    return otherPreview;
  });
};

export { createAttachmentPreviews };
