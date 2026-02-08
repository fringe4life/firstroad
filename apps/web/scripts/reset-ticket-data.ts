/**
 * Script to reset only Ticket and Comment data while preserving user data
 * This is safer than a full database reset when you want to keep user accounts
 *
 * Run from repo root: bun run reset:tickets --filter=@firstroad/web
 * Or from apps/web with DATABASE_URL set: bun scripts/reset-ticket-data.ts
 */

import { prisma } from "@firstroad/db";

async function resetTicketData() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  console.log("🔄 Starting ticket data reset...");

  try {
    // Delete comments first (due to foreign key constraints)
    console.log("🗑️  Deleting comments...");
    const deletedComments = await prisma.comment.deleteMany({});
    console.log(`✅ Deleted ${deletedComments.count} comments`);

    // Delete tickets
    console.log("🗑️  Deleting tickets...");
    const deletedTickets = await prisma.ticket.deleteMany({});
    console.log(`✅ Deleted ${deletedTickets.count} tickets`);

    console.log("🎉 Ticket data reset completed successfully!");
    console.log("👥 User data preserved (accounts, sessions, etc.)");
  } catch (error) {
    console.error("❌ Error resetting ticket data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
resetTicketData();
