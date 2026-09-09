import { orm } from "@firstroad/db";
import type { TicketListFilter } from "@firstroad/db/client-types";

const escapeIlike = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");

const filteredTickets = (filter: TicketListFilter) => {
  let query = orm.Ticket;
  if (filter.organizationId) {
    query = query.where({ organizationId: filter.organizationId });
  }
  if (filter.userId) {
    query = query.where({ userId: filter.userId });
  }
  if (filter.search) {
    const pattern = `%${escapeIlike(filter.search)}%`;
    query = query.where((ticket) => ticket.title.ilike(pattern));
  }
  return query;
};

const orderedTickets = (filter: TicketListFilter) => {
  const query = filteredTickets(filter);
  const descending = filter.sortValue === "desc";
  switch (filter.sortKey) {
    case "bounty":
      return query.orderBy((ticket) =>
        descending ? ticket.bounty.desc() : ticket.bounty.asc(),
      );
    case "deadline":
      return query.orderBy((ticket) =>
        descending ? ticket.deadline.desc() : ticket.deadline.asc(),
      );
    default:
      return query.orderBy((ticket) =>
        descending ? ticket.createdAt.desc() : ticket.createdAt.asc(),
      );
  }
};

const ticketsWithUser = (filter: TicketListFilter) =>
  orderedTickets(filter).include("user", (user) => user.select("name"));

export { filteredTickets, ticketsWithUser };
