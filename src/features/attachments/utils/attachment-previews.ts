type AttachmentPreviewKind = "image" | "pdf" | "other";

interface ImageAttachmentPreview {
  id: string;
  file: File;
  kind: "image";
  objectUrl: string;
}

interface PdfAttachmentPreview {
  id: string;
  file: File;
  kind: "pdf";
}

interface OtherAttachmentPreview {
  id: string;
  file: File;
  kind: "other";
}

type AttachmentPreview =
  | ImageAttachmentPreview
  | PdfAttachmentPreview
  | OtherAttachmentPreview;

const SUPPORTED_IMAGE_TYPES = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);

const PDF_MIME_TYPE = "application/pdf";

const createAttachmentPreviews = (
  files: FileList | File[] | null | undefined,
): AttachmentPreview[] => {
  if (!files) {
    return [];
  }

  const fileArray = Array.from(files);

  return fileArray.map((file, index) => {
    const id = `${file.name}-${file.lastModified}-${index}`;

    if (SUPPORTED_IMAGE_TYPES.has(file.type)) {
      const imagePreview: ImageAttachmentPreview = {
        id,
        file,
        kind: "image",
        objectUrl: URL.createObjectURL(file),
      };

      return imagePreview;
    }

    if (file.type === PDF_MIME_TYPE) {
      const pdfPreview: PdfAttachmentPreview = {
        id,
        file,
        kind: "pdf",
      };

      return pdfPreview;
    }

    const otherPreview: OtherAttachmentPreview = {
      id,
      file,
      kind: "other",
    };

    return otherPreview;
  });
};

export type {
  AttachmentPreview,
  AttachmentPreviewKind,
  ImageAttachmentPreview,
  OtherAttachmentPreview,
  PdfAttachmentPreview,
};
export { createAttachmentPreviews };
