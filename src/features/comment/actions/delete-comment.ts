"use server";

import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { prisma } from "@/lib/prisma";
import { invalidateCommentAndTicketComments } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteComment = async (
  commentId: string,
): Promise<ActionState<string>> => {
  const user = await getUserOrRedirect();

  // verify comment exists
  const { data: commentWithOwnership, error: commentError } = await tryCatch(
    () =>
      itemWithOwnership(
        () =>
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
        user,
      ),
  );
  if (commentError) {
    return fromErrorToActionState<string>(commentError);
  }
  if (!commentWithOwnership?.isOwner) {
    return toActionState<string>("Comment not found", "ERROR");
  }

  const { error: deleteError } = await tryCatch(() =>
    prisma.comment.delete({
      where: { id: commentId },
    }),
  );
  if (deleteError) {
    return fromErrorToActionState<string>(deleteError);
  }

  invalidateCommentAndTicketComments(
    commentWithOwnership.id,
    commentWithOwnership.ticketId,
    commentWithOwnership.ticket.slug,
  );

  return toActionState<string>("Comment deleted successfully", "SUCCESS");
};
