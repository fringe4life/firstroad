"use server";

import { revalidateTag } from "next/cache";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { prisma } from "@/lib/prisma";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteComment = async (commentId: string) => {
  const { error } = await tryCatch(async () => {
    const session = await getSessionOrRedirect();
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        ticket: true,
      },
    });

    if (!comment) {
      return fromErrorToActionState("Comment not found");
    }

    if (!isOwner(session, comment)) {
      return fromErrorToActionState("You can only delete your own comments");
    }

    await prisma.$transaction(async (tx) => {
      await tx.comment.delete({
        where: { id: commentId },
      });
    });
    revalidateTag("tickets", "max");
    revalidateTag(`ticket-${comment.ticketId}`, "max");
    revalidateTag(`comments-${comment.ticketId}`, "max");
    revalidateTag(`comment-${commentId}`, "max");

    return toActionState("Comment deleted successfully", "SUCCESS");
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("Comment deleted successfully", "SUCCESS");
};
