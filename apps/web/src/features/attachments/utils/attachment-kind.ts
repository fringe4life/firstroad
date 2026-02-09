export type AttachmentKind = "image" | "document" | "archive" | "other";

const IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "svg",
] as const;

const DOCUMENT_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "rtf",
  "md",
  "odt",
] as const;

const ARCHIVE_EXTENSIONS = ["zip", "tar", "gz", "tgz", "rar", "7z"] as const;

const hasExtension = (name: string, list: readonly string[]): boolean => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return list.includes(ext);
};

const getAttachmentKindFromName = (name: string): AttachmentKind => {
  if (hasExtension(name, IMAGE_EXTENSIONS)) {
    return "image";
  }

  if (hasExtension(name, DOCUMENT_EXTENSIONS)) {
    return "document";
  }

  if (hasExtension(name, ARCHIVE_EXTENSIONS)) {
    return "archive";
  }

  return "other";
};

export { getAttachmentKindFromName };
