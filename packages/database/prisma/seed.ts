import { all } from "@prisma/orm-postgres/orm-client";
import { db, orm, pool } from "../src/index.ts";
import { createComments } from "./seed-data/comments.ts";
import { createTickets } from "./seed-data/tickets.ts";

const main = async () => {
  await orm.Comment.where(all()).deleteAll();
  await orm.Ticket.where(all()).deleteAll();

  const existingUsers = await orm.User.orderBy((user) => user.createdAt.asc())
    .select("id")
    .include("members", (member) => member.select("organizationId"))
    .all();

  const usersWithOrganisations = existingUsers
    .map((user) => ({
      organizationIds: user.members.map((member) => member.organizationId),
      userId: user.id,
    }))
    .filter((user) => user.organizationIds.length > 0);

  const createdTickets = await db.transaction(async (tx) => {
    const tickets = createTickets(usersWithOrganisations);
    if (tickets.length === 0) {
      return [];
    }

    await tx.orm.public.Ticket.createAll(tickets);

    return tx.orm.public.Ticket.select("id")
      .orderBy((ticket) => ticket.createdAt.asc())
      .all();
  });

  if (createdTickets.length > 0) {
    const comments = createComments(
      createdTickets.map((ticket) => ticket.id),
      existingUsers.map((user) => user.id),
    );

    await orm.Comment.createAll(comments);
  }
};

main()
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
    await pool.end();
  });
