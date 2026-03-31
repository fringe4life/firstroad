import { ArchiveIcon, FileIcon, FileImage, ImageIcon } from "lucide-react";
import type { Mime } from "./types";

const ATTACHMENT_KIND_ICONS = {
  image: <ImageIcon className="h-4 w-4" />,
  document: <FileImage className="h-4 w-4" />,
  archive: <ArchiveIcon className="h-4 w-4" />,
  other: <FileIcon className="h-4 w-4" />,
} as const;

const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "application/pdf",
] satisfies Mime[];

const SUPPORTED_IMAGE_TYPES = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);

const FILE_NAME_MAX = 255;
const MAX_SIZE_MB = 4;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const NORMALIZED_MIME_FROM_BROWSER: Record<string, Mime> = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/gif": "image/gif",
  "image/webp": "image/webp",
  "application/pdf": "application/pdf",
};

const normalizeAcceptedMime = (input: string): Mime | null => {
  const normalized = NORMALIZED_MIME_FROM_BROWSER[input];
  return normalized ?? null;
};

export {
  ACCEPTED_FILE_TYPES,
  ATTACHMENT_KIND_ICONS,
  FILE_NAME_MAX,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  NORMALIZED_MIME_FROM_BROWSER,
  normalizeAcceptedMime,
  SUPPORTED_IMAGE_TYPES,
};
