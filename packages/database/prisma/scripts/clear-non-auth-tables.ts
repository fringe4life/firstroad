import { all } from "@prisma/orm-postgres/orm-client";
import { orm } from "../../src/prisma/db.ts";

const main = async () => {
  const deletedComments = await orm.Comment.where(all()).deleteAndCount();
  const deletedTickets = await orm.Ticket.where(all()).deleteAndCount();

  console.log(
    `Cleared ${deletedComments} comments and ${deletedTickets} tickets.`,
  );
};

main().catch(() => {
  process.exit(1);
});
