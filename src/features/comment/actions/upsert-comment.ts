/** biome-ignore-all lint/style/noMagicNumbers: are well explained zod schema */
"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod/v4";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { prisma } from "@/lib/prisma";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const upsertCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1024, "Comment is too long"),
});

export const upsertComment = async (
  commentId: string | undefined,

  ticketId: string,
  _state: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<CommentWithUserInfo>> => {
  const session = await getSessionOrRedirect();

  const { data, error } = await tryCatch<
    ActionState<CommentWithUserInfo>,
    unknown
  >(async () => {
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

      if (!(comment && isOwner(session, comment))) {
        return toActionState(
          "Comment not found or you don't have permission to edit it",
          "ERROR",
        );
      }
    }

    const parsedData = upsertCommentSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    const comment = await prisma.comment.upsert({
      where: {
        id: commentId || "",
      },
      update: {
        content: parsedData.content,
      },
      create: {
        content: parsedData.content,
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

    revalidateTag("tickets", "max");
    revalidateTag(`ticket-${ticketId}`, "max");
    revalidateTag(`comments-${ticketId}`, "max");
    if (comment.id) {
      revalidateTag(`comment-${comment.id}`, "max");
    }

    // Add isOwner property to the comment
    const commentWithOwnership = {
      ...comment,
      isOwner: isOwner(session, comment),
    };

    return toActionState(
      commentId
        ? "Comment updated successfully"
        : "Comment created successfully",
      "SUCCESS",
      undefined,
      commentWithOwnership,
    );
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  // data is defined when there is no error above
  return data as ActionState<CommentWithUserInfo>;
};
