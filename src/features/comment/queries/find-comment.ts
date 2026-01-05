import type { CommentModel } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";

const findComment = async (id: string): Promise<Maybe<CommentModel>> => {
  const { data } = await tryCatch(() =>
    prisma.comment.findUnique({
      where: { id },
    }),
  );
  return data;
};

export { findComment };
