"use server";

import { prisma } from "@firstroad/db";
import type {
  CommentCreateInput,
  CommentModel,
  CommentUncheckedCreateInput,
  CommentUncheckedUpdateInput,
  CommentUpdateInput,
  CommentWhereUniqueInput,
} from "@firstroad/db/client-types";
import { COMMENT_WITH_USER_INCLUDE } from "@/features/comment/constants";
import type { CommentWithUserInfo } from "@/features/comment/types";

type CommentCreateData = CommentCreateInput | CommentUncheckedCreateInput;
type CommentUpdateData = CommentUpdateInput | CommentUncheckedUpdateInput;

interface CommentCreateArgs {
  data: CommentCreateData;
  includeUser?: boolean;
}

interface CommentUpdateArgs {
  where: CommentWhereUniqueInput;
  data: CommentUpdateData;
  includeUser?: boolean;
}

/**
 * Low-level DAL for comment CRUD.
 *
 * These helpers centralize Prisma access for comments and provide an option
 * to include the common "comment with user name" shape. Server actions
 * remain responsible for auth, validation, and cache invalidation.
 */
async function createComment(
  args: CommentCreateArgs & { includeUser: true },
): Promise<CommentWithUserInfo>;
async function createComment(args: CommentCreateArgs): Promise<CommentModel>;
async function createComment({
  data,
  includeUser,
}: CommentCreateArgs): Promise<CommentWithUserInfo | CommentModel> {
  if (includeUser) {
    return await prisma.comment.create({
      data,
      include: COMMENT_WITH_USER_INCLUDE,
    });
  }

  return await prisma.comment.create({ data });
}

async function updateComment(
  args: CommentUpdateArgs & { includeUser: true },
): Promise<CommentWithUserInfo>;
async function updateComment(args: CommentUpdateArgs): Promise<CommentModel>;
async function updateComment({
  where,
  data,
  includeUser,
}: CommentUpdateArgs): Promise<CommentWithUserInfo | CommentModel> {
  if (includeUser) {
    return await prisma.comment.update({
      where,
      data,
      include: COMMENT_WITH_USER_INCLUDE,
    });
  }

  return await prisma.comment.update({
    where,
    data,
  });
}

const deleteCommentRecord = async (
  where: CommentWhereUniqueInput,
): Promise<void> => {
  await prisma.comment.delete({ where });
};

export { createComment, updateComment, deleteCommentRecord };
