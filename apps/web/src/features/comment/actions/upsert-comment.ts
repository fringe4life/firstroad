/** biome-ignore-all lint/style/noMagicNumbers: are well explained zod schema */
"use server";
import type { CommentWhereUniqueInput } from "@firstroad/db/client-types";
import { maxLength, minLength, object, pipe, safeParse, string } from "valibot";
import { itemWithPermissions } from "@/features/auth/dto/item-with-permissions";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { findTicket } from "@/features/ticket/queries/find-ticket";
import type { Maybe } from "@/types";
import { invalidateCommentAndTicketComments } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { createComment, updateComment } from "../dal/comment-crud";
import { findComment } from "../queries/find-comment";

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
  const formDataObject = Object.fromEntries(formData.entries());
  const parsedData = safeParse(upsertCommentSchema, formDataObject);

  if (!parsedData.success) {
    return fromErrorToActionState(parsedData.issues, formData);
  }
  const user = await getUserOrRedirect();

  // Verify the ticket exists
  const { data: ticket, error } = await tryCatch(() => findTicket(ticketId));
  if (error) {
    return fromErrorToActionState(error);
  }
  if (!ticket) {
    return toActionState("Ticket not found", "ERROR");
  }

  if (commentId) {
    // If updating, verify comment exists and user owns it and can update it
    const { data: commentWithOwnership, error: commentError } = await tryCatch(
      () => itemWithPermissions(findComment(commentId), user, "COMMENT"),
    );
    if (commentError) {
      return fromErrorToActionState(commentError);
    }
    if (!commentWithOwnership?.isOwner) {
      return toActionState("Comment not found", "ERROR");
    }

    if (!commentWithOwnership?.canUpdate) {
      return toActionState(
        "You do not have permission to update this comment",
        "ERROR",
      );
    }
  } else {
    // If creating, verify user has permission to create comments in this organization
    const permission = await getMemberPermission(
      user.id,
      ticket.organizationId,
      "COMMENT",
    );
    if (!permission?.canCreate) {
      return toActionState(
        "You do not have permission to create comments",
        "ERROR",
      );
    }
  }

  const {
    output: { content },
  } = parsedData;

  const whereClause: CommentWhereUniqueInput = {
    id: commentId ?? "",
  };

  const { data: comment, error: commentError } = await tryCatch(() =>
    commentId
      ? updateComment({
          where: whereClause,
          data: { content },
          includeUser: true,
        })
      : createComment({
          data: {
            content,
            ticketId,
            userId: user.id,
          },
          includeUser: true,
        }),
  );
  if (commentError) {
    return fromErrorToActionState(commentError);
  }
  if (!comment) {
    return toActionState("Comment not created", "ERROR");
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
  return toActionState(
    successMessage,
    "SUCCESS",
    undefined,
    commentWithOwnership,
  );
};
