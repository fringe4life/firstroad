import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import { createComments } from "./seed-data/comments";
import { createTickets } from "./seed-data/tickets";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const main = async () => {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();

  const existingUsers = await prisma.user.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  const createdTickets = await prisma.$transaction(async (tx) => {
    const tickets = createTickets(existingUsers.map((user) => user.id));

    await tx.ticket.createMany({
      data: tickets,
    });

    return await tx.ticket.findMany({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
  });

  // Create comments in a transaction
  const comments = createComments(
    createdTickets.map((ticket) => ticket.id),
    existingUsers.map((user) => user.id),
  );

  await prisma.comment.createMany({
    data: comments,
  });
};

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
