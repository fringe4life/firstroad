import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { createComments } from "./seed-data/comments";
import { createTickets } from "./seed-data/tickets";
import { users } from "./seed-data/users";

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

  // Create users using Better Auth's API
  // Note: This will trigger email verification, but for seeding we'll handle it gracefully
  const createdUsers = await Promise.all(
    users.map(async (user) => {
      try {
        // Use Better Auth's sign-up API to create users properly
        // This will handle password hashing automatically
        const result = await auth.api.signUpEmail({
          body: {
            name: user.name,
            email: user.email,
            password: user.password,
          },
          headers: new Headers(), // Empty headers for seeding
        });

        console.log(
          `✅ Created user: ${user.email} (email verification may be required)`,
        );
        return result.user;
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error);
        // For seeding purposes, if the API fails, we'll create the user directly
        console.log(
          `🔄 Falling back to direct user creation for ${user.email}`,
        );

        const createdUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            emailVerified: null,
          },
        });

        console.log(
          `✅ Created user directly: ${user.email} (password will need to be set on first sign-in)`,
        );
        return createdUser;
      }
    }),
  );

  console.log(`✅ Created ${createdUsers.length} users`);

  console.log("📋 Creating UserInfo for users...");

  // Create UserInfo in a transaction
  await prisma.$transaction(async (tx) => {
    const userInfoData = createdUsers.map((user) => ({
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
    const tickets = createTickets(createdUsers.map((user) => user.id));

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
    createdUsers.map((user) => user.id),
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
