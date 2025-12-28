"use server";

import { updateTag } from "next/cache";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { prisma } from "@/lib/prisma";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteComment = async (commentId: string) => {
  const { error } = await tryCatch(async () => {
    const user = await getUserOrRedirect();
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        ticket: true,
      },
    });

    if (!comment) {
      return fromErrorToActionState("Comment not found");
    }

    if (!isOwner(user, comment)) {
      return fromErrorToActionState("You can only delete your own comments");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
    updateTag("tickets");
    updateTag(`ticket-${comment.ticketId}`);
    updateTag(`comments-${comment.ticketId}`);
    updateTag(`comment-${commentId}`);

    return toActionState("Comment deleted successfully", "SUCCESS");
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("Comment deleted successfully", "SUCCESS");
};
