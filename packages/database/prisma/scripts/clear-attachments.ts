import { PrismaClient } from "../../generated/prisma/client";
import { createAdapter } from "../../src/adapter";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const adapter = createAdapter(connectionString);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const deletedCommentAttachments = await prisma.commentAttachment.deleteMany();
  const deletedTicketAttachments = await prisma.ticketAttachment.deleteMany();

  console.log(
    `Cleared ${deletedCommentAttachments.count} comment attachments and ${deletedTicketAttachments.count} ticket attachments.`,
  );
};

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
