export type AttachmentKind = "image" | "document" | "other";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp"] as const;

const DOCUMENT_EXTENSIONS = ["pdf"] as const;

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

  return "other";
};

export { getAttachmentKindFromName };
