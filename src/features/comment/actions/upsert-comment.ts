"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { ticketEditPath } from "@/path";

const upsertCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1024, "Comment is too long"),
});

const upsertComment = async (
  commentId: string | undefined,
  ticketId: string,
  _state: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const session = await getAuthOrRedirect();
  
  try {
    // Verify the ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return toActionState("Ticket not found", "ERROR");
    }

    // If updating, verify comment exists and user owns it
    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment || !isOwner(session, comment)) {
        return toActionState("Comment not found or you don't have permission to edit it", "ERROR");
      }
    }

    const data = upsertCommentSchema.parse({
      content: formData.get("content"),
    });

    // Ensure UserInfo exists for the user
    await prisma.userInfo.upsert({
      where: { userId: session.user?.id as string },
      update: {},
      create: { userId: session.user?.id as string },
    });

    await prisma.comment.upsert({
      where: {
        id: commentId || "",
      },
      update: {
        content: data.content,
      },
      create: {
        content: data.content,
        ticketId,
        userId: session.user?.id as string,
      },
    });

    // Revalidate the ticket page to show the updated comment
    revalidatePath(ticketEditPath(ticketId));
    
    return toActionState(
      commentId ? "Comment updated successfully" : "Comment created successfully", 
      "SUCCESS"
    );
  } catch (err: unknown) {
    console.error("Error upserting comment:", err);
    return fromErrorToActionState(err, formData);
  }
};

export { upsertComment };
