import { orm } from "@firstroad/db";

const commentsWithUser = () =>
  orm.Comment.include("user", (user) => user.select("name"));

const getCommentsList = async ({
  ticketSlug,
  cursor,
  take,
}: {
  ticketSlug: string;
  cursor?: string;
  take: number;
}) => {
  const ticket = await orm.Ticket.where({ slug: ticketSlug })
    .select("id")
    .first();
  if (!ticket) {
    return [];
  }

  const query = commentsWithUser()
    .where({ ticketId: ticket.id })
    .orderBy((comment) => comment.id.desc());

  if (cursor) {
    return query
      .cursor({ id: cursor })
      .limit(take + 1)
      .all();
  }

  return query.limit(take + 1).all();
};

export { getCommentsList };
