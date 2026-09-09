import { orm } from "@firstroad/db";

const getCommentsCount = async ({
  ticketSlug,
}: {
  ticketSlug: string;
}): Promise<number> => {
  const ticket = await orm.Ticket.where({ slug: ticketSlug })
    .select("id")
    .first();
  if (!ticket) {
    return 0;
  }
  const { count } = await orm.Comment.where({ ticketId: ticket.id }).aggregate(
    (aggregate) => ({ count: aggregate.count() }),
  );
  return count;
};

export { getCommentsCount };
