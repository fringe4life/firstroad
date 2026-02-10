import { prisma } from "@firstroad/db";
import { cacheTag } from "next/cache";
import { TICKET_WITH_USER_INCLUDE } from "@/features/ticket/constants";
import type { Maybe } from "@/types";
import { ticketCache, ticketsCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { BaseTicket } from "../types";
export const getTicketBySlug = async (
  slug: string,
): Promise<Maybe<BaseTicket>> => {
  // Only cache the database query
  "use cache";
  cacheTag(ticketsCache());
  cacheTag(ticketCache(slug));

  const { data } = await tryCatch(() =>
    prisma.ticket.findUnique({
      where: { slug },
      include: TICKET_WITH_USER_INCLUDE,
    }),
  );

  return data;
};
