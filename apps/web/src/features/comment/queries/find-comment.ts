import { prisma } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { VerifyComment } from "../types";

const findComment = async (id: string): Promise<Maybe<VerifyComment>> => {
  const { data } = await tryCatch(() =>
    prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        ticketId: true,
        ticket: { select: { organizationId: true } },
      },
    }),
  );
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    userId: data.userId,
    ticketId: data.ticketId,
    organizationId: data.ticket.organizationId,
  };
};

export { findComment };
