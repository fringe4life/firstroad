import { orm } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { VerifyComment } from "../types";

const findComment = async (id: string): Promise<Maybe<VerifyComment>> => {
  const { data } = await tryCatch(() =>
    orm.Comment.where({ id })
      .select("id", "ticketId", "userId")
      .include("ticket", (ticket) => ticket.select("organizationId"))
      .first(),
  );
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    organizationId: data.ticket.organizationId,
    ticketId: data.ticketId,
    userId: data.userId,
  };
};

export { findComment };
