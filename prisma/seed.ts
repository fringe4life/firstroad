import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { users } from "./seed-data/users";
import { createTickets } from "./seed-data/tickets";

const prisma = new PrismaClient();

const main = async () => {
  console.log("🧹 Clearing existing data...");
  
  // Clear existing data in reverse dependency order
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

  // Create all users at once
  await prisma.user.createMany({
    data: usersWithHashedPasswords,
  });

  // Get all created users to access their IDs
  const createdUsers = await prisma.user.findMany({
    select: { id: true, email: true },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`✅ Created ${createdUsers.length} users`);

  console.log("📋 Creating UserInfo for users...");
  
  // Prepare UserInfo data using user IDs
  const userInfoData = createdUsers.map(user => ({
    userId: user.id,
  }));

  // Create all UserInfo records at once
  await prisma.userInfo.createMany({
    data: userInfoData,
  });

  console.log(`✅ Created ${createdUsers.length} UserInfo records`);

  console.log("🎫 Creating tickets...");
  
  // Create tickets using User IDs directly
  const tickets = createTickets(createdUsers.map(user => user.id));
  
  await prisma.ticket.createMany({
    data: tickets,
  });

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Created ${createdUsers.length} users`);
  console.log(`📋 Created ${createdUsers.length} UserInfo records`);
  console.log(`🎫 Created ${tickets.length} tickets`);
};

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
