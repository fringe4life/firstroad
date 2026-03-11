import type { Maybe } from "@/types";
import { normalizeAcceptedMime } from "../constants";
import type { Mime } from "../types";

// Only map extensions we actually accept in validation.
const EXTENSION_TO_MIME: Record<string, Mime> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
};

const DEFAULT_MIME_TYPE = "application/octet-stream" satisfies Mime;

const getMimeTypeFromName = (name: string): Mime => {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed || trimmed.endsWith(".")) {
    return DEFAULT_MIME_TYPE;
  }

  const parts = trimmed.split(".");
  const ext = parts.length > 1 ? (parts.at(-1) ?? "") : "";
  if (!ext) {
    return DEFAULT_MIME_TYPE;
  }

  const candidate = EXTENSION_TO_MIME[ext];
  const normalized = candidate ? normalizeAcceptedMime(candidate) : null;
  if (normalized) {
    return normalized;
  }

  return DEFAULT_MIME_TYPE;
};

const getMimeTypeFromFile = (file: File): string | Mime => {
  const fromBrowser: Maybe<string> =
    file.type && file.type.trim().length > 0 ? file.type : null;
  if (fromBrowser) {
    return fromBrowser;
  }
  return getMimeTypeFromName(file.name);
};

export { getMimeTypeFromFile, getMimeTypeFromName };
