import { orm } from "@firstroad/db";

const getAllTicketSlugs = async () => {
  const tickets = await orm.Ticket.select("slug").all();
  return tickets.map((ticket) => ({ slug: ticket.slug }));
};

export { getAllTicketSlugs };
