/** biome-ignore-all lint/style/noMagicNumbers: are well explained zod schema */
"use server";

import { maxLength, minLength, object, parse, pipe, string } from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { invalidateCommentAndTicketComments } from "@/utils/invalidate-cache";
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
  commentId: Exclude<Maybe<string>, null>,
  ticketId: string,
  _state: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<CommentWithUserInfo>> => {
  const user = await getUserOrRedirect();

  const { data: ticket, error } = await tryCatch(() =>
    // Verify the ticket exists
    prisma.ticket.findUnique({
      where: { id: ticketId },
    }),
  );
  if (error) {
    return fromErrorToActionState(error);
  }
  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }

  if (commentId) {
    // If updating, verify comment exists and user owns it
    const { data: comment, error: commentError } = await tryCatch(() =>
      prisma.comment.findUnique({
        where: { id: commentId },
      }),
    );
    if (commentError) {
      return fromErrorToActionState(commentError);
    }
    if (!comment) {
      return toActionState("Comment not found", "ERROR");
    }

    const userIsOwner = isOwner(user, comment);

    if (!userIsOwner) {
      return toActionState(
        "Comment not found or you don't have permission to edit it",
        "ERROR",
      );
    }
  }

  const formDataObject = Object.fromEntries(formData.entries());
  const parsedData = parse(upsertCommentSchema, formDataObject);

  const upsertData = commentId
    ? {
        where: { id: commentId },
        update: { content: parsedData.content },
        create: {
          content: parsedData.content,
          ticketId,
          userId: user.id,
        },
      }
    : {
        where: { id: "" },
        update: { content: parsedData.content },
        create: {
          content: parsedData.content,
          ticketId,
          userId: user.id,
        },
      };

  const { data: comment, error: commentError } = await tryCatch(() =>
    prisma.comment.upsert({
      ...upsertData,
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
    }),
  );
  if (commentError) {
    return fromErrorToActionState(commentError);
  }
  if (!comment) {
    return toActionState("Comment not found", "ERROR");
  }

  // Add isOwner property to the comment
  const commentWithOwnership = {
    ...comment,
    isOwner: isOwner(user, comment),
  };

  const successMessage = commentId
    ? "Comment updated successfully"
    : "Comment created successfully";

  invalidateCommentAndTicketComments(comment.id, ticketId, ticket.slug);
  // revalidatePath(ticketPath(ticket.slug));
  return toActionState(
    successMessage,
    "SUCCESS",
    undefined,
    commentWithOwnership,
  );
};
