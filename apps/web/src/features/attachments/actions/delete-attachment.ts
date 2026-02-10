"use server";

import { revalidatePath } from "next/cache";
import { minLength, object, pipe, safeParse, string, ValiError } from "valibot";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUser } from "@/features/auth/queries/get-user";
import { deleteTicketAttachmentRecord } from "@/features/ticket/dal/delete-ticket-attachment";
import { findTicket } from "@/features/ticket/queries/find-ticket";
import { ticketPath } from "@/path";
import { invalidateTicketAndAttachments } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const deleteAttachmentInputSchema = object({
  attachmentId: pipe(string(), minLength(1, "Attachment id is required")),
  ownerId: pipe(string(), minLength(1, "Owner id is required")),
});

interface DeleteAttachmentArgs {
  attachmentId: string;
  ownerId: string;
}

const deleteAttachment = async (
  { attachmentId, ownerId }: DeleteAttachmentArgs,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> => {
  const parseResult = safeParse(deleteAttachmentInputSchema, {
    attachmentId,
    ownerId,
  });

  if (!parseResult.success) {
    return fromErrorToActionState(new ValiError(parseResult.issues));
  }
  const { user } = await getUser();

  if (!user?.id) {
    return toActionState(
      "You must be signed in to delete attachments",
      "ERROR",
    );
  }

  const ticket = await itemWithOwnership(findTicket(ownerId), user);

  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }

  if (!ticket.isOwner) {
    return toActionState(
      "Only the ticket owner can delete attachments",
      "ERROR",
    );
  }

  const { error } = await tryCatch(() =>
    deleteTicketAttachmentRecord({
      organizationId: ticket.organizationId,
      ticketId: ticket.id,
      attachmentId,
      ownerId: ticket.id,
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  invalidateTicketAndAttachments(ticket.slug, ticket.id);
  revalidatePath(ticketPath(ticket.slug));

  return toActionState("Attachment deleted", "SUCCESS");
};

export { deleteAttachment };
