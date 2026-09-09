"use cache";
import { orm } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { Maybe } from "@/types";
import { ticketCache, ticketsCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { BaseTicket } from "../types";

const ticketWithUser = () =>
  orm.Ticket.include("user", (user) => user.select("name"));

export const getTicketBySlug = async (
  slug: string,
): Promise<Maybe<BaseTicket>> => {
  cacheTag(ticketsCache());
  cacheTag(ticketCache(slug));

  const { data } = await tryCatch(() =>
    ticketWithUser().where({ slug }).first(),
  );
  return data;
};

export const getTicketWithReferencesBySlug = async (
  slug: string,
): Promise<
  Maybe<BaseTicket & { referencedTickets: { slug: string; title: string }[] }>
> => {
  cacheTag(ticketsCache());
  cacheTag(ticketCache(slug));

  const { data } = await tryCatch(() =>
    ticketWithUser()
      .include("outgoingReferences", (reference) =>
        reference.include("to", (ticket) => ticket.select("slug", "title")),
      )
      .where({ slug })
      .first(),
  );

  if (!data) {
    return null;
  }

  return {
    ...data,
    referencedTickets: data.outgoingReferences.map((reference) => reference.to),
  };
};
