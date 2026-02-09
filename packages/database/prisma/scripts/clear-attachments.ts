import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

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
