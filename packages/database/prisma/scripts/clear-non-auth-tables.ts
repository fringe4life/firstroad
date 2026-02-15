import { PrismaClient } from "../../generated/prisma/client";
import { createAdapter } from "../../src/adapter";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const adapter = createAdapter(connectionString);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const deletedComments = await prisma.comment.deleteMany();
  const deletedTickets = await prisma.ticket.deleteMany();

  console.log(
    `Cleared ${deletedComments.count} comments and ${deletedTickets.count} tickets.`,
  );
};

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
