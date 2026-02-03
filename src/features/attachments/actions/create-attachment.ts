"use server";

import { revalidatePath } from "next/cache";
import {
  array,
  maxLength,
  minLength,
  object,
  pipe,
  safeParse,
  string,
  ValiError,
} from "valibot";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUser } from "@/features/auth/queries/get-user";
import { findTicket } from "@/features/ticket/queries/find-ticket";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/path";
import { invalidateTicketAndAttachments } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { FILE_NAME_MAX } from "../constants";
import { attachmentS3Key } from "../utils/presign-attachments";

const fileNameSchema = pipe(
  string(),
  minLength(1, "File name is required"),
  maxLength(
    FILE_NAME_MAX,
    `File name must be at most ${FILE_NAME_MAX} characters`,
  ),
);

const filesSchema = object({
  files: pipe(
    array(fileNameSchema, "Select at least one file to upload"),
    minLength(1, "Select at least one file to upload"),
  ),
});

const createAttachment = async (
  ticketId: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const { user } = await getUser();
  if (!user?.id) {
    return toActionState(
      "You must be signed in to upload attachments",
      "ERROR",
    );
  }

  const ticket = await itemWithOwnership(findTicket(ticketId));
  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }
  if (!ticket.isOwner) {
    return toActionState("Only the ticket owner can add attachments", "ERROR");
  }

  if (typeof globalThis.Bun === "undefined" || !("s3" in globalThis.Bun)) {
    return toActionState(
      "Attachments require Bun runtime (S3 is not available)",
      "ERROR",
    );
  }

  // Use globalThis.Bun.s3 (no top-level import from "bun") so this module loads in Node; Bun docs also support import { s3 } from "bun" when runtime is always Bun.
  const s3 = globalThis.Bun.s3;

  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f instanceof File && f.size > 0);
  const fileNames = validFiles.map((f) => f.name);

  const parseResult = safeParse(filesSchema, { files: fileNames });
  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }

  const { error } = await tryCatch(async () => {
    const validatedNames = parseResult.output.files;

    // Create all attachment rows in parallel (one round-trip wave to DB)
    const attachments = await Promise.all(
      validatedNames.map((name) =>
        prisma.attachment.create({ data: { name, ticketId } }),
      ),
    );

    // Upload all files to S3 in parallel (one wave of concurrent writes)
    await Promise.all(
      attachments.map(async (attachment, i) => {
        const file = validFiles[i];
        const key = attachmentS3Key(ticketId, attachment.id, attachment.name);
        const data = await file.arrayBuffer();
        await s3.file(key).write(data);
      }),
    );
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  invalidateTicketAndAttachments(ticket.slug, ticketId);
  revalidatePath(ticketPath(ticket.slug));
  return toActionState("Attachment(s) uploaded", "SUCCESS");
};

export { createAttachment };
