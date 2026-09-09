import { orm } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { List } from "@/types";
import { invitationsForOrganizationCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { InvitationRow } from "../types";

const getInvitationsById = async (
  organizationId: string,
): Promise<List<InvitationRow>> => {
  "use cache: remote";
  cacheTag(invitationsForOrganizationCache(organizationId));

  const { data: invitations } = await tryCatch(async () => {
    const rows = await orm.Invitation.where({
      organizationId,
      status: "pending",
    })
      .orderBy((invitation) => invitation.createdAt.desc())
      .include("user", (user) => user.select("name"))
      .select("createdAt", "email", "id")
      .all();

    return rows.map(({ user, createdAt, ...invitation }) => ({
      ...invitation,
      invitedAt: new Date(createdAt),
      inviterName: user.name,
    }));
  });

  return invitations ?? [];
};

export { getInvitationsById };
