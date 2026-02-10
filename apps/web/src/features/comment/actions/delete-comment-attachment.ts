"use server";

import { revalidatePath } from "next/cache";
import { minLength, object, pipe, safeParse, string, ValiError } from "valibot";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUser } from "@/features/auth/queries/get-user";
import { deleteCommentAttachmentRecord } from "@/features/comment/dal/delete-comment-attachment";
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

const deleteCommentAttachmentInputSchema = object({
  attachmentId: pipe(string(), minLength(1, "Attachment id is required")),
  ownerId: pipe(string(), minLength(1, "Owner id is required")),
});

interface DeleteCommentAttachmentArgs {
  attachmentId: string;
  ownerId: string;
}

const deleteCommentAttachment = async (
  { attachmentId, ownerId }: DeleteCommentAttachmentArgs,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> => {
  const parseResult = safeParse(deleteCommentAttachmentInputSchema, {
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

  const comment = await itemWithOwnership(findComment(ownerId), user);

  if (!comment) {
    return toActionState("Comment not found", "ERROR");
  }

  if (!comment.isOwner) {
    return toActionState(
      "Only the comment owner can delete attachments",
      "ERROR",
    );
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

  const { error } = await tryCatch(() =>
    deleteCommentAttachmentRecord({
      organizationId: ticket.organizationId,
      commentId: comment.id,
      attachmentId,
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  invalidateTicketAndAttachments(ticket.slug, ticket.id);
  revalidatePath(ticketPath(ticket.slug));

  return toActionState("Attachment deleted", "SUCCESS");
};

export { deleteCommentAttachment };
