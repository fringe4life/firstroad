import { PrismaClient } from "@prisma/client";
import { createComments } from "./seed-data/comments";
import { createTickets } from "./seed-data/tickets";

const prisma = new PrismaClient();

const main = async () => {
  console.log("🧹 Clearing tickets and comments (not users)...");
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();

  console.log("👤 Fetching existing users...");
  const existingUsers = await prisma.user.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  console.log(`✅ Found ${existingUsers.length} users`);

  console.log("🎫 Creating tickets...");
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

  console.log(`✅ Created ${createdTickets.length} tickets`);

  console.log("💬 Creating comments...");

  // Create comments in a transaction
  const comments = createComments(
    createdTickets.map((ticket) => ticket.id),
    existingUsers.map((user) => user.id),
  );

  await prisma.$transaction(async (tx) => {
    await tx.comment.createMany({
      data: comments,
    });
  });

  console.log("✅ Database seeded successfully!");
  console.log(`🎫 Created ${createdTickets.length} tickets`);
  console.log(`💬 Created ${comments.length} comments`);
};

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
