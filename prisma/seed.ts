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
    select: {
      id: true,
      members: {
        select: {
          organizationId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  const usersWithOrganisations = existingUsers
    .map((user) => ({
      userId: user.id,
      organizationIds: user.members.map((member) => member.organizationId),
    }))
    .filter((user) => user.organizationIds.length > 0);
  const createdTickets = await prisma.$transaction(async (tx) => {
    const tickets = createTickets(usersWithOrganisations);
    if (tickets.length === 0) {
      return [];
    }

    await tx.ticket.createMany({
      data: tickets,
    });

    return await tx.ticket.findMany({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
  });

  // Create comments in a transaction
  if (createdTickets.length > 0) {
    const comments = createComments(
      createdTickets.map((ticket) => ticket.id),
      existingUsers.map((user) => user.id),
    );

    await prisma.comment.createMany({
      data: comments,
    });
  }
};

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
