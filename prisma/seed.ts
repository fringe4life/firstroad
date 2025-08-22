import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { users } from "./seed-data/users";
import { createTickets } from "./seed-data/tickets";
import { createComments } from "./seed-data/comments";

const prisma = new PrismaClient();

const main = async () => {
  console.log("🧹 Clearing existing data...");
  
  // Clear existing data in reverse dependency order
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.userInfo.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Data cleared successfully");

  console.log("👤 Creating users...");
  
  // Hash passwords and prepare user data
  const usersWithHashedPasswords = await Promise.all(
    users.map(async (user) => ({
      name: user.name,
      email: user.email,
      password: await hash(user.password),
    }))
  );

  // Create users in a transaction
  const createdUsers = await prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: usersWithHashedPasswords,
    });

    return await tx.user.findMany({
      select: { id: true, email: true },
      orderBy: { createdAt: 'asc' }
    });
  });

  console.log(`✅ Created ${createdUsers.length} users`);

  console.log("📋 Creating UserInfo for users...");
  
  // Create UserInfo in a transaction
  await prisma.$transaction(async (tx) => {
    const userInfoData = createdUsers.map(user => ({
      userId: user.id,
    }));

    await tx.userInfo.createMany({
      data: userInfoData,
    });
  });

  console.log(`✅ Created ${createdUsers.length} UserInfo records`);

  console.log("🎫 Creating tickets...");
  
  // Create tickets in a transaction
  const createdTickets = await prisma.$transaction(async (tx) => {
    const tickets = createTickets(createdUsers.map(user => user.id));
    
    await tx.ticket.createMany({
      data: tickets,
    });

    return await tx.ticket.findMany({
      select: { id: true },
      orderBy: { createdAt: 'asc' }
    });
  });

  console.log(`✅ Created ${createdTickets.length} tickets`);

  console.log("💬 Creating comments...");
  
  // Create comments in a transaction
  const comments = createComments(
    createdTickets.map(ticket => ticket.id),
    createdUsers.map(user => user.id)
  );
  
  await prisma.$transaction(async (tx) => {
    await tx.comment.createMany({
      data: comments,
    });
  });

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Created ${createdUsers.length} users`);
  console.log(`📋 Created ${createdUsers.length} UserInfo records`);
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
