import { prisma } from "@firstroad/db";
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
    const rows = await prisma.invitation.findMany({
      where: { organizationId, status: "pending" },
      select: {
        id: true,
        email: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(({ user, createdAt, ...invitation }) => ({
      ...invitation,
      invitedAt: createdAt,
      inviterName: user.name,
    }));
  });

  return invitations;
};

export { getInvitationsById };
