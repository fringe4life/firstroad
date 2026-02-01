import { prisma } from "@/lib/prisma";
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
        role: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      invitedAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
      inviterName: invitation.user.name,
    }));
  });

  return invitations;
};

export { getInvitationsById };
