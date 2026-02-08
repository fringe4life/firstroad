import { prisma } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { BaseTicket } from "../types";
export const getTicketBySlugApi = async (
  slug: string,
): Promise<Maybe<BaseTicket>> => {
  const { data } = await tryCatch(() =>
    prisma.ticket.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
  );

  return data;
};
