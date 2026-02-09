"use server";

import { prisma } from "@firstroad/db";
import { s3 } from "bun";
import { revalidatePath } from "next/cache";
import {
  array,
  custom,
  file,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  minSize,
  pipe,
  safeParse,
  ValiError,
} from "valibot";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUser } from "@/features/auth/queries/get-user";
import { findComment } from "@/features/comment/queries/find-comment";
import { findTicket } from "@/features/ticket/queries/find-ticket";
import { ticketPath } from "@/path";
import { invalidateTicketAndAttachments } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import {
  ACCEPTED_FILE_TYPES,
  FILE_NAME_MAX,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
} from "../constants";
import { attachmentS3Key } from "../utils/presign-attachments";

const fileSchema = pipe(
  file("Please select a file."),
  mimeType(ACCEPTED_FILE_TYPES, "File type is not supported"),
  minSize(0, "File must not be empty"),
  maxSize(MAX_SIZE_BYTES, `The maximum file size is ${MAX_SIZE_MB}MB`),
  custom<File>((f) => {
    const fileValue = f as File;
    return fileValue.name.length >= 1 && fileValue.name.length <= FILE_NAME_MAX;
  }, `File name must be between 1 and ${FILE_NAME_MAX} characters`),
);

const filesSchema = pipe(
  array(fileSchema),
  minLength(1, "File is required"),
  maxLength(5, "You can only upload up to 5 files at a time"),
);

const createCommentAttachment = async (
  commentId: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const files = Array.from(formData.getAll("files"));

  const parseResult = safeParse(filesSchema, files);
  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }
  const { user } = await getUser();
  if (!user?.id) {
    return toActionState(
      "You must be signed in to upload attachments",
      "ERROR",
    );
  }

  const comment = await itemWithOwnership(findComment(commentId), user);

  if (!comment) {
    return toActionState("Comment not found", "ERROR");
  }

  if (!comment.isOwner) {
    return toActionState("Only the comment owner can add attachments", "ERROR");
  }

  const { data: ticket, error: ticketError } = await tryCatch(() =>
    findTicket(comment.ticketId),
  );

  if (ticketError) {
    return fromErrorToActionState(ticketError);
  }

  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }

  const validatedFiles = parseResult.output;

  const { error } = await tryCatch(async () => {
    // Create all attachment rows in parallel (one round-trip wave to DB)
    const attachments = await Promise.all(
      validatedFiles.map((fileValue) =>
        prisma.commentAttachment.create({
          data: { name: fileValue.name, commentId },
        }),
      ),
    );
    // Upload all files to S3 in parallel (one wave of concurrent writes)
    await Promise.all(
      attachments.map(async (attachment, i) => {
        const fileValue = validatedFiles[i];
        const key = attachmentS3Key(
          ticket.organizationId,
          "comment",
          comment.id,
          attachment.id,
          attachment.name,
        );
        const data = await fileValue.arrayBuffer();
        await s3.file(key).write(data);
      }),
    );
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  invalidateTicketAndAttachments(ticket.slug, ticket.id);
  revalidatePath(ticketPath(ticket.slug));
  return toActionState("Attachment(s) uploaded", "SUCCESS");
};

export { createCommentAttachment };
