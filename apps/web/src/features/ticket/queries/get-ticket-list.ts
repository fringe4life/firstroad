import type { TicketListFilter } from "@firstroad/db/client-types";
import { cacheTag } from "next/cache";
import { ticketsCache } from "@/utils/cache-tags";
import { ticketsWithUser } from "./ticket-query";

// biome-ignore lint/suspicious/useAwait: needed for use cache
const getTicketList = async ({
  filter,
  takeAmount,
  skip,
}: {
  filter: TicketListFilter;
  takeAmount: number;
  skip: number;
}) => {
  "use cache: remote";
  cacheTag(ticketsCache());
  return ticketsWithUser(filter).offset(skip).limit(takeAmount).all();
};

export { getTicketList };
