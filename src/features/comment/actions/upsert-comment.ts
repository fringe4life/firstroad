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
import type { CommentWithUserInfo } from "@/features/comment/types";

const upsertCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1024, "Comment is too long"),
});

export const upsertComment = async (
  commentId: string | undefined,
  ticketId: string,
  _state: ActionState<unknown>,
  formData: FormData
): Promise<ActionState<CommentWithUserInfo>> => {
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

    const data = upsertCommentSchema.parse(Object.fromEntries(formData.entries()));

    const comment = await prisma.comment.upsert({
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
      include: {
        userInfo: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Revalidate the ticket page to show the updated comment
    revalidatePath(ticketEditPath(ticketId));
    
    // Add isOwner property to the comment
    const commentWithOwnership = {
      ...comment,
      isOwner: isOwner(session, comment),
    };
    
    return toActionState(
      commentId ? "Comment updated successfully" : "Comment created successfully", 
      "SUCCESS",
      undefined,
      commentWithOwnership
    );
  } catch (err: unknown) {
    console.error("Error upserting comment:", err);
    return fromErrorToActionState(err, formData);
  }
};