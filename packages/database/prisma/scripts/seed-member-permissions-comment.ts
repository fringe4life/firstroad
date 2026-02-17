import { addMemberPermissions } from "@firstroad/db/member-permissions";
import { PrismaClient } from "../../generated/prisma/client";
import { createAdapter } from "../../src/adapter";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const adapter = createAdapter(connectionString);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  // Find members that have TICKET permission but no COMMENT permission
  const membersWithTicketOnly = await prisma.member.findMany({
    where: {
      permissions: {
        some: { resourceType: "TICKET" },
        none: { resourceType: "COMMENT" },
      },
    },
    select: { id: true },
  });

  console.log(
    `Found ${membersWithTicketOnly.length} members missing COMMENT permission`,
  );

  let added = 0;
  for (const member of membersWithTicketOnly) {
    try {
      await addMemberPermissions(prisma, member.id, ["COMMENT"]);
      added++;
    } catch (error) {
      console.error(
        `Failed to add COMMENT permission for member ${member.id}:`,
        error,
      );
    }
  }

  console.log(`Done! Added COMMENT permission to ${added} members.`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
