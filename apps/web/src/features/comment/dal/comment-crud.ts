"use server";

import { orm } from "@firstroad/db";
import type { CommentModel } from "@firstroad/db/client-types";
import type { CommentWithUserInfo } from "@/features/comment/types";

interface CommentWriteInput {
  content: string;
  ticketId: string;
  userId: string;
}

interface CommentPatchInput {
  content: string;
}

interface CommentCreateArgs {
  data: CommentWriteInput;
  includeUser?: boolean;
}

interface CommentUpdateArgs {
  data: CommentPatchInput;
  id: string;
  includeUser?: boolean;
}

const withUser = () =>
  orm.Comment.include("user", (user) => user.select("name"));

const requireComment = <T>(row: T | null): T => {
  if (!row) {
    throw new Error("Comment not found");
  }
  return row;
};

async function createComment(
  args: CommentCreateArgs & { includeUser: true },
): Promise<CommentWithUserInfo>;
async function createComment(args: CommentCreateArgs): Promise<CommentModel>;
async function createComment({
  data,
  includeUser,
}: CommentCreateArgs): Promise<CommentWithUserInfo | CommentModel> {
  const payload = {
    ...data,
    content: data.content as never,
  };
  if (includeUser) {
    return await withUser().create(payload);
  }
  return await orm.Comment.create(payload);
}

async function updateComment(
  args: CommentUpdateArgs & { includeUser: true },
): Promise<CommentWithUserInfo>;
async function updateComment(args: CommentUpdateArgs): Promise<CommentModel>;
async function updateComment({
  id,
  data,
  includeUser,
}: CommentUpdateArgs): Promise<CommentWithUserInfo | CommentModel> {
  const payload = {
    content: data.content as never,
    updatedAt: new Date().toISOString(),
  };
  if (includeUser) {
    return requireComment(await withUser().where({ id }).update(payload));
  }
  return requireComment(await orm.Comment.where({ id }).update(payload));
}

const deleteCommentRecord = async (id: string): Promise<void> => {
  await orm.Comment.where({ id }).delete();
};

export { createComment, deleteCommentRecord, updateComment };
