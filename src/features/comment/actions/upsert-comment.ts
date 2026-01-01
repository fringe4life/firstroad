/** biome-ignore-all lint/style/noMagicNumbers: are well explained zod schema */
"use server";

import { revalidatePath } from "next/cache";
import { maxLength, minLength, object, parse, pipe, string } from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/path";
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
  commentId: string | undefined,

  ticketId: string,
  _state: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<CommentWithUserInfo>> => {
  console.log("[upsertComment] Starting", {
    commentId,
    ticketId,
    formDataEntries: Object.fromEntries(formData.entries()),
  });

  const user = await getUserOrRedirect();
  console.log("[upsertComment] User authenticated", { userId: user.id });

  const { data: ticket, error } = await tryCatch(() =>
    // Verify the ticket exists
    prisma.ticket.findUnique({
      where: { id: ticketId },
    }),
  );
  if (error) {
    console.error("[upsertComment] Ticket lookup error", { error, ticketId });
    return fromErrorToActionState(error);
  }
  if (!ticket) {
    console.warn("[upsertComment] Ticket not found", { ticketId });
    return toActionState("Ticket not found", "ERROR");
  }
  console.log("[upsertComment] Ticket verified", { ticketId: ticket.id });

  if (commentId) {
    console.log("[upsertComment] Updating existing comment", { commentId });
    // If updating, verify comment exists and user owns it
    const { data: comment, error: commentError } = await tryCatch(() =>
      prisma.comment.findUnique({
        where: { id: commentId },
      }),
    );
    if (commentError) {
      console.error("[upsertComment] Comment lookup error", {
        error: commentError,
        commentId,
      });
      return fromErrorToActionState(commentError);
    }
    if (!comment) {
      console.warn("[upsertComment] Comment not found", { commentId });
      return toActionState("Comment not found", "ERROR");
    }

    const userIsOwner = isOwner(user, comment);
    console.log("[upsertComment] Ownership check", {
      commentId,
      userId: user.id,
      commentUserId: comment.userId,
      isOwner: userIsOwner,
    });

    if (!userIsOwner) {
      console.warn("[upsertComment] User does not own comment", {
        commentId,
        userId: user.id,
        commentUserId: comment.userId,
      });
      return toActionState(
        "Comment not found or you don't have permission to edit it",
        "ERROR",
      );
    }
  } else {
    console.log("[upsertComment] Creating new comment");
  }

  const formDataObject = Object.fromEntries(formData.entries());
  console.log("[upsertComment] Parsing form data", { formDataObject });

  const parsedData = parse(upsertCommentSchema, formDataObject);
  console.log("[upsertComment] Form data validated", {
    contentLength: parsedData.content.length,
  });

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

  console.log("[upsertComment] Upserting comment", {
    commentId: commentId || "new",
    ticketId,
    userId: user.id,
    contentLength: parsedData.content.length,
  });

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
    console.error("[upsertComment] Comment upsert error", {
      error: commentError,
      commentId,
      ticketId,
    });
    return fromErrorToActionState(commentError);
  }
  if (!comment) {
    console.error("[upsertComment] Comment upsert returned null", {
      commentId,
      ticketId,
    });
    return toActionState("Comment not found", "ERROR");
  }
  console.log("[upsertComment] Comment upserted successfully", {
    commentId: comment.id,
    ticketId: comment.ticketId,
  });

  console.log("[upsertComment] Updating cache tags", {
    ticketId,
    commentId: comment.id,
  });
  invalidateCommentAndTicketComments(comment.id, ticketId, ticket.slug);
  revalidatePath(ticketPath(ticket.slug));
  // Add isOwner property to the comment
  const commentWithOwnership = {
    ...comment,
    isOwner: isOwner(user, comment),
  };

  const successMessage = commentId
    ? "Comment updated successfully"
    : "Comment created successfully";
  console.log("[upsertComment] Returning success", {
    commentId: comment.id,
    message: successMessage,
  });

  return toActionState(
    successMessage,
    "SUCCESS",
    undefined,
    commentWithOwnership,
  );
};
