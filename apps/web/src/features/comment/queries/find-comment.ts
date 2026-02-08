import { prisma } from "@firstroad/db";
import type { CommentModel } from "@firstroad/db/client-types";
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
