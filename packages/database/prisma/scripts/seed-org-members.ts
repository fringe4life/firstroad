import { db, orm, pool, uuidv7 } from "../../src/index.ts";
import { addMemberPermissions } from "../../src/member-permissions.ts";

const main = async () => {
  const users = await orm.User.select("email", "id")
    .include("members", (member) => member.select("organizationId"))
    .all();

  const organizations = await orm.Organization.select("id", "name").all();

  console.log(
    `Found ${users.length} users and ${organizations.length} organizations`,
  );

  const pendingMemberships = users.flatMap((user) => {
    const userOrgIds = new Set(
      user.members.map((member) => member.organizationId),
    );
    return organizations
      .filter((organization) => !userOrgIds.has(organization.id))
      .map((organization) => ({ organization, user }));
  });

  const results = await Promise.allSettled(
    pendingMemberships.map(async ({ user, organization }) => {
      const member = await orm.Member.create({
        id: uuidv7(),
        organizationId: organization.id,
        role: "member",
        userId: user.id,
      });
      await addMemberPermissions(member.id, ["TICKET", "COMMENT"]);
      return { email: user.email, orgName: organization.name };
    }),
  );

  let added = 0;
  for (const [index, result] of results.entries()) {
    if (result.status === "fulfilled") {
      added += 1;
      console.log(`Added ${result.value.email} to ${result.value.orgName}`);
      continue;
    }
    const pending = pendingMemberships[index];
    console.error(
      `Failed to add ${pending?.user.email ?? "unknown"} to ${pending?.organization.name ?? "unknown"}:`,
      result.reason,
    );
  }

  console.log(`Done! Added ${added} memberships.`);
};

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
    await pool.end();
  });
