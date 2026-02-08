import { prisma } from "@firstroad/db";
import type { List } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { InvitationRow } from "../types";

const getInvitationsById = async (
  organizationId: string,
): Promise<List<InvitationRow>> => {
  const { data: invitations } = await tryCatch(async () => {
    const rows = await prisma.invitation.findMany({
      where: { organizationId },
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
