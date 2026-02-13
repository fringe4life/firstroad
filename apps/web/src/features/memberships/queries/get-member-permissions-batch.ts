import { prisma } from "@firstroad/db";
import { tryCatch } from "@/utils/try-catch";
import type { ResourcePermission, ResourceType } from "../types";

/**
 * Batch fetch member permissions for a user across multiple organizations
 * @param userId - The user ID to check permissions for
 * @param organizationIds - Array of organization IDs to check
 * @param resourceType - The resource type to fetch permissions for
 * @returns Map of organizationId -> ResourcePermission
 */
const getMemberPermissionsBatch = async (
  userId: string,
  organizationIds: string[],
  resourceType: ResourceType,
): Promise<Map<string, ResourcePermission>> => {
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
        permissions: {
          where: { resourceType },
          select: {
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
          take: 1,
        },
      },
    }),
  );

  if (!members) {
    return new Map();
  }

  return new Map(
    members
      .filter((m) => m.permissions[0])
      .map(({ organizationId, permissions }) => [
        organizationId,
        permissions[0],
      ]),
  );
};

export { getMemberPermissionsBatch };
