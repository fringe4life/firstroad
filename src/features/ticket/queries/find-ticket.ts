import type { TicketModel } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";

const findTicket = async (id: string): Promise<Maybe<TicketModel>> => {
  const { data } = await tryCatch(() =>
    prisma.ticket.findUnique({
      where: { id },
    }),
  );
  return data;
};

export { findTicket };
