type Mime = `${string}/${string}`;

import { ArchiveIcon, FileIcon, FileImage, ImageIcon } from "lucide-react";

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

const FILE_NAME_MAX = 255;
const MAX_SIZE_MB = 4;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export {
  ACCEPTED_FILE_TYPES,
  FILE_NAME_MAX,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  ATTACHMENT_KIND_ICONS,
};
