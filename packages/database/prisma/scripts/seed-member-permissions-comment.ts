import { orm } from "../../src/index.ts";
import { addMemberPermissions } from "../../src/member-permissions.ts";

const main = async () => {
  const membersWithTicketOnly = await orm.Member.where((member) =>
    member.permissions.some((permission) =>
      permission.resourceType.eq("TICKET"),
    ),
  )
    .where((member) =>
      member.permissions.none((permission) =>
        permission.resourceType.eq("COMMENT"),
      ),
    )
    .select("id")
    .all();

  console.log(
    `Found ${membersWithTicketOnly.length} members missing COMMENT permission`,
  );

  const results = await Promise.allSettled(
    membersWithTicketOnly.map((member) =>
      addMemberPermissions(member.id, ["COMMENT"]).then(() => member.id),
    ),
  );

  let added = 0;
  for (const [index, result] of results.entries()) {
    if (result.status === "fulfilled") {
      added += 1;
      continue;
    }
    const memberId = membersWithTicketOnly[index]?.id ?? "unknown";
    console.error(
      `Failed to add COMMENT permission for member ${memberId}:`,
      result.reason,
    );
  }

  console.log(`Done! Added COMMENT permission to ${added} members.`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
