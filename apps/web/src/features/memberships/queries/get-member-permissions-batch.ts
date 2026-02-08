import { prisma } from "@firstroad/db";
import { tryCatch } from "@/utils/try-catch";
import type { MemberPermission } from "../types";

/**
 * Batch fetch member permissions for a user across multiple organizations
 * @param userId - The user ID to check permissions for
 * @param organizationIds - Array of organization IDs to check
 * @returns Map of organizationId -> MemberPermission
 */
const getMemberPermissionsBatch = async (
  userId: string,
  organizationIds: string[],
): Promise<Map<string, MemberPermission>> => {
  if (organizationIds.length === 0) {
    return new Map();
  }

  const uniqueOrgIds = [...new Set(organizationIds)];

  const { data: members } = await tryCatch(() =>
    prisma.member.findMany({
      where: {
        userId,
        organizationId: { in: uniqueOrgIds },
      },
      select: {
        organizationId: true,
        canDeleteTicket: true,
        canUpdateTicket: true,
      },
    }),
  );

  if (!members) {
    return new Map();
  }

  return new Map(
    members.map(({ organizationId, ...rest }) => [
      organizationId,
      {
        ...rest,
      },
    ]),
  );
};

export { getMemberPermissionsBatch };
