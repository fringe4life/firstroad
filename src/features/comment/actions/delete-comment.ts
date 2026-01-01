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
    return fromErrorToActionState("Comment not found");
  }

  if (!isOwner(user, comment)) {
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
