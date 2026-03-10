import type { Maybe } from "@/types";

const IMAGE_MIME_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
};

const DOCUMENT_MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  rtf: "application/rtf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  odt: "application/vnd.oasis.opendocument.text",
};

const ARCHIVE_MIME_TYPES: Record<string, string> = {
  zip: "application/zip",
  tar: "application/x-tar",
  gz: "application/gzip",
  tgz: "application/gzip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
};

const DEFAULT_MIME_TYPE = "application/octet-stream";

const getExtension = (name: string): string =>
  name.split(".").pop()?.toLowerCase() ?? "";

const getMimeTypeFromName = (name: string): string => {
  const ext = getExtension(name);
  if (!ext) {
    return DEFAULT_MIME_TYPE;
  }

  if (ext in IMAGE_MIME_TYPES) {
    return IMAGE_MIME_TYPES[ext];
  }

  if (ext in DOCUMENT_MIME_TYPES) {
    return DOCUMENT_MIME_TYPES[ext];
  }

  if (ext in ARCHIVE_MIME_TYPES) {
    return ARCHIVE_MIME_TYPES[ext];
  }

  return DEFAULT_MIME_TYPE;
};

const getMimeTypeFromFile = (file: File): string => {
  const fromBrowser: Maybe<string> =
    file.type && file.type.trim().length > 0 ? file.type : null;
  if (fromBrowser) {
    return fromBrowser;
  }
  return getMimeTypeFromName(file.name);
};

export { getMimeTypeFromFile, getMimeTypeFromName };
