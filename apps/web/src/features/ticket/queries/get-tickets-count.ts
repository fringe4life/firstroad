import type { TicketListFilter } from "@firstroad/db/client-types";
import { filteredTickets } from "./ticket-query";

const getTicketsCount = async ({
  filter,
}: {
  filter: TicketListFilter;
}): Promise<number> => {
  const { count } = await filteredTickets(filter).aggregate((aggregate) => ({
    count: aggregate.count(),
  }));
  return count;
};

export { getTicketsCount };
