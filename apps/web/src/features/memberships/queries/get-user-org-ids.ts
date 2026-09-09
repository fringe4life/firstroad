import { orm } from "@firstroad/db";
import { tryCatch } from "@/utils/try-catch";

/**
 * Get all organization IDs that a user is a member of
 * Used for pre-fetching permissions in parallel with ticket queries
 *
 * @param userId - The user ID to get organization memberships for
 * @returns Array of organization IDs
 */
const getUserOrgIds = async (userId: string): Promise<string[]> => {
  const { data: members } = await tryCatch(async () =>
    orm.Member.where({ userId }).select("organizationId").all(),
  );

  if (!members) {
    return [];
  }

  return members.map((member) => member.organizationId);
};

export { getUserOrgIds };
