import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

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
