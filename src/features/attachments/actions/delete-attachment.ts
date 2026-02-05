"use server";

import { s3 } from "bun";
import { revalidatePath } from "next/cache";
import { minLength, object, pipe, safeParse, string, ValiError } from "valibot";
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
import { attachmentS3Key } from "../utils/presign-attachments";

const deleteAttachmentInputSchema = object({
  attachmentId: pipe(string(), minLength(1, "Attachment id is required")),
  ticketId: pipe(string(), minLength(1, "Ticket id is required")),
});

interface DeleteAttachmentArgs {
  attachmentId: string;
  ticketId: string;
}

const deleteAttachment = async (
  { attachmentId, ticketId }: DeleteAttachmentArgs,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> => {
  const { user } = await getUser();

  if (!user?.id) {
    return toActionState(
      "You must be signed in to delete attachments",
      "ERROR",
    );
  }

  const parseResult = safeParse(deleteAttachmentInputSchema, {
    attachmentId,
    ticketId,
  });

  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }

  const ticket = await itemWithOwnership(findTicket(ticketId), user);

  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }

  if (!ticket.isOwner) {
    return toActionState(
      "Only the ticket owner can delete attachments",
      "ERROR",
    );
  }

  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
  });

  if (!attachment) {
    return toActionState("Attachment not found", "ERROR");
  }

  const key = attachmentS3Key(
    ticket.organizationId,
    ticket.id,
    attachment.id,
    attachment.name,
  );

  const { error: s3Error } = await tryCatch(() => s3.file(key).delete());

  if (s3Error) {
    return fromErrorToActionState(
      new Error("Could not delete attachment from storage"),
    );
  }

  const { error: dbError } = await tryCatch(() =>
    prisma.attachment.delete({
      where: { id: attachment.id },
    }),
  );

  if (dbError) {
    return fromErrorToActionState(
      new Error("Attachment removed from storage but not from database"),
    );
  }

  invalidateTicketAndAttachments(ticket.slug, ticket.id);
  revalidatePath(ticketPath(ticket.slug));

  return toActionState("Attachment deleted", "SUCCESS");
};

export { deleteAttachment };
