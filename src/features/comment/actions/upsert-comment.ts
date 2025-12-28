/** biome-ignore-all lint/style/noMagicNumbers: are well explained zod schema */
"use server";

import { updateTag } from "next/cache";
import { maxLength, minLength, object, parse, pipe, string } from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { prisma } from "@/lib/prisma";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const upsertCommentSchema = object({
  content: pipe(
    string(),
    minLength(1, "Comment cannot be empty"),
    maxLength(1024, "Comment is too long"),
  ),
});

export const upsertComment = async (
  commentId: string | undefined,

  ticketId: string,
  _state: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<CommentWithUserInfo>> => {
  const user = await getUserOrRedirect();

  const { data, error } = await tryCatch(async () => {
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

      if (!(comment && isOwner(user, comment))) {
        return toActionState(
          "Comment not found or you don't have permission to edit it",
          "ERROR",
        );
      }
    }

    const parsedData = parse(
      upsertCommentSchema,
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
        userId: user.id,
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

    updateTag("tickets");
    updateTag(`ticket-${ticketId}`);
    updateTag(`comments-${ticketId}`);
    if (comment.id) {
      updateTag(`comment-${comment.id}`);
    }

    // Add isOwner property to the comment
    const commentWithOwnership = {
      ...comment,
      isOwner: isOwner(user, comment),
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
