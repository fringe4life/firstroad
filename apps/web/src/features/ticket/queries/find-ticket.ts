import { prisma } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { VerifyTicket } from "../types";

const findTicket = async (id: string): Promise<Maybe<VerifyTicket>> => {
  const { data } = await tryCatch(() =>
    prisma.ticket.findUnique({
      where: { id },
      select: { id: true, userId: true, organizationId: true, slug: true },
    }),
  );
  return data;
};

export { findTicket };
