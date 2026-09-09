import { orm } from "@firstroad/db";
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

  const { data: members } = await tryCatch(async () =>
    orm.Member.where((member) => member.userId.eq(userId))
      .where((member) => member.organizationId.in(uniqueOrgIds))
      .select("organizationId")
      .include("permissions", (permission) =>
        permission
          .where({ resourceType })
          .select("canCreate", "canDelete", "canUpdate")
          .limit(1),
      )
      .all(),
  );

  if (!members) {
    return new Map();
  }

  const result = new Map<string, ResourcePermission>();
  for (const { organizationId, permissions } of members) {
    const [permission] = permissions;
    if (permission) {
      result.set(organizationId, permission);
    }
  }
  return result;
};

export { getMemberPermissionsBatch };
