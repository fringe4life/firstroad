import { orm } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { VerifyTicket } from "../types";

const findTicket = async (id: string): Promise<Maybe<VerifyTicket>> => {
  const { data } = await tryCatch(() =>
    orm.Ticket.where({ id })
      .select("id", "organizationId", "slug", "userId")
      .first(),
  );
  return data;
};

export { findTicket };
