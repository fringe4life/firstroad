"use server";

import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { prisma } from "@/lib/prisma";
import { invalidateCommentAndTicketComments } from "@/utils/invalidate-cache";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteComment = async (commentId: string) => {
  const user = await getUserOrRedirect();

  const { data: comment, error } = await tryCatch(() =>
    prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        ticket: true,
      },
    }),
  );
  if (error) {
    return fromErrorToActionState(error);
  }
  if (!comment) {
    // Return success instead of error if comment is already deleted
    // This handles race conditions where optimistic delete already removed it
    return toActionState("Comment already deleted", "SUCCESS");
  }

  const userIsOwner = isOwner(user, comment);

  if (!userIsOwner) {
    return fromErrorToActionState("You can only delete your own comments");
  }

  const { error: deleteError } = await tryCatch(() =>
    prisma.comment.delete({
      where: { id: commentId },
    }),
  );
  if (deleteError) {
    return fromErrorToActionState(deleteError);
  }

  if (comment.ticket.slug) {
    invalidateCommentAndTicketComments(
      commentId,
      comment.ticketId,
      comment.ticket.slug,
    );
  }

  return toActionState("Comment deleted successfully", "SUCCESS");
};
