"use server";
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
import { createTicketAttachments } from "@/features/ticket/dal/create-ticket-attachment";
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

const fileSchema = pipe(
  file("Please select a file."),
  mimeType(ACCEPTED_FILE_TYPES, "File type is not supported"),
  minSize(0, "File must not be empty"),
  maxSize(MAX_SIZE_BYTES, `The maximum file size is ${MAX_SIZE_MB}MB`),
  custom<File>((f) => {
    const file = f as File;
    return file.name.length >= 1 && file.name.length <= FILE_NAME_MAX;
  }, `File name must be between 1 and ${FILE_NAME_MAX} characters`),
);

const filesSchema = pipe(
  array(fileSchema),
  minLength(1, "File is required"),
  maxLength(5, "You can only upload up to 5 files at a time"),
);

const createAttachment = async (
  ticketId: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const { user } = await getUser();
  const files = Array.from(formData.getAll("files"));

  const parseResult = safeParse(filesSchema, files);
  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }
  if (!user?.id) {
    return toActionState(
      "You must be signed in to upload attachments",
      "ERROR",
    );
  }

  const ticket = await itemWithOwnership(findTicket(ticketId), user);
  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }
  if (!ticket.isOwner) {
    return toActionState("Only the ticket owner can add attachments", "ERROR");
  }

  const validatedFiles = parseResult.output;

  const { error } = await tryCatch(() =>
    createTicketAttachments({
      organizationId: ticket.organizationId,
      ticketId,
      files: validatedFiles,
      ownerId: ticket.id,
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  invalidateTicketAndAttachments(ticket.slug, ticketId);
  revalidatePath(ticketPath(ticket.slug));
  return toActionState("Attachment(s) uploaded", "SUCCESS");
};

export { createAttachment };
