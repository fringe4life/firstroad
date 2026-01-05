"use server";

import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { prisma } from "@/lib/prisma";
import { invalidateCommentAndTicketComments } from "@/utils/invalidate-cache";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteComment = async (commentId: string) => {
  // const user = await getUserOrRedirect();

  // verify comment exists
  const { data: commentWithOwnership, error: commentError } = await tryCatch(
    () =>
      itemWithOwnership(() =>
        prisma.comment.findUnique({
          where: { id: commentId },
          include: {
            ticket: {
              select: {
                slug: true,
              },
            },
          },
        }),
      ),
  );
  if (commentError) {
    return fromErrorToActionState(commentError);
  }
  if (!commentWithOwnership?.isOwner) {
    return toActionState("Comment not found", "ERROR");
  }

  const { error: deleteError } = await tryCatch(() =>
    prisma.comment.delete({
      where: { id: commentId },
    }),
  );
  if (deleteError) {
    return fromErrorToActionState(deleteError);
  }

  if (commentWithOwnership.ticket.slug) {
    invalidateCommentAndTicketComments(
      commentId,
      commentWithOwnership.ticketId,
      commentWithOwnership.ticket.slug,
    );
  }

  return toActionState("Comment deleted successfully", "SUCCESS");
};
