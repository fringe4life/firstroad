import {
  array,
  custom,
  file,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  minSize,
  object,
  pipe,
  string,
} from "valibot";
import {
  ACCEPTED_FILE_TYPES,
  FILE_NAME_MAX,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
} from "./constants";

export const fileSchema = pipe(
  file("Please select a file."),
  mimeType(ACCEPTED_FILE_TYPES, "File type is not supported"),
  minSize(0, "File must not be empty"),
  maxSize(MAX_SIZE_BYTES, `The maximum file size is ${MAX_SIZE_MB}MB`),
  custom<File>((f) => {
    const fileValue = f as File;
    return fileValue.name.length >= 1 && fileValue.name.length <= FILE_NAME_MAX;
  }, `File name must be between 1 and ${FILE_NAME_MAX} characters`),
);

export const filesSchema = pipe(
  array(fileSchema),
  minLength(1, "File is required"),
  maxLength(5, "You can only upload up to 5 files at a time"),
);

export const optionalFilesSchema = pipe(
  array(fileSchema),
  minLength(0),
  maxLength(5, "You can only upload up to 5 files at a time"),
);

export const deleteAttachmentInputSchema = object({
  attachmentId: pipe(string(), minLength(1, "Attachment id is required")),
  ownerId: pipe(string(), minLength(1, "Owner id is required")),
});
