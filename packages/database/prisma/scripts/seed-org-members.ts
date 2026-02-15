import { PrismaClient } from "../../generated/prisma/client";
import { createAdapter } from "../../src/adapter";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const adapter = createAdapter(connectionString);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  // Fetch all users with their current memberships
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      members: { select: { organizationId: true } },
    },
  });

  // Fetch all organizations
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
  });

  console.log(
    `Found ${users.length} users and ${organizations.length} organizations`,
  );

  let added = 0;

  for (const user of users) {
    const userOrgIds = new Set(user.members.map((m) => m.organizationId));

    for (const org of organizations) {
      if (!userOrgIds.has(org.id)) {
        try {
          // Direct Prisma insert (Better Auth's auth.api.addMember requires
          // server-only context which isn't available in standalone scripts)
          const member = await prisma.member.create({
            data: {
              id: crypto.randomUUID(),
              userId: user.id,
              organizationId: org.id,
              role: "member",
              createdAt: new Date(),
            },
          });
          await prisma.memberPermission.create({
            data: {
              memberId: member.id,
              resourceType: "TICKET",
              canCreate: true,
              canUpdate: true,
              canDelete: true,
            },
          });
          console.log(`Added ${user.email} to ${org.name}`);
          added++;
        } catch (error) {
          console.error(`Failed to add ${user.email} to ${org.name}:`, error);
        }
      }
    }
  }

  console.log(`Done! Added ${added} memberships.`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
