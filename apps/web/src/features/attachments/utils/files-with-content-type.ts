import type { List } from "@/types";
import { normalizeAcceptedMime } from "../constants";
import type { Mime } from "../types";
import { getMimeTypeFromFile } from "./attachment-mime-type";

export interface FileWithContentType {
  contentType: Mime;
  file: File;
}

/**
 * Maps a list of validated files to { file, contentType } using the accepted
 * MIME policy. Returns [] when files is missing or empty.
 */
const filesWithContentType = (files: List<File>): FileWithContentType[] => {
  if (!files || files.length === 0) {
    return [];
  }
  return files.map((file) => {
    const inferred = getMimeTypeFromFile(file);
    const contentType =
      normalizeAcceptedMime(inferred) ??
      normalizeAcceptedMime(file.type ?? "") ??
      "application/octet-stream";
    return { file, contentType };
  });
};

export { filesWithContentType };
