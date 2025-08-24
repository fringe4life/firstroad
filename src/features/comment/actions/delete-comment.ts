"use server";

import { revalidatePath } from "next/cache";
import { fromErrorToActionState, toActionState } from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { ticketEditPath } from "@/path";

export const deleteComment = async (commentId: string) => {
  console.log("🗑️ deleteComment - Starting deletion for commentId:", commentId);
  const session = await getAuthOrRedirect();
  
  try {
    console.log("🗑️ deleteComment - Starting transaction");
    await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: {
          id: commentId,
        },
        include: {
          ticket: true,
        },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (!isOwner(session, comment)) {
        throw new Error("You can only delete your own comments");
      }

      console.log("🗑️ deleteComment - Deleting comment from database");
      await tx.comment.delete({ where: { id: commentId } });
      
      // Revalidate after successful deletion
      console.log("🗑️ deleteComment - Revalidating path:", ticketEditPath(comment.ticketId));
      revalidatePath(ticketEditPath(comment.ticketId));
    });
    
    console.log("🗑️ deleteComment - Transaction completed successfully");
    return toActionState("Comment deleted successfully", "SUCCESS");
  } catch (err) {
    console.log("🗑️ deleteComment - Error occurred:", err);
    return fromErrorToActionState(err);
  }
};
