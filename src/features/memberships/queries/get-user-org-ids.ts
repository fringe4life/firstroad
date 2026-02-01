import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/utils/try-catch";

/**
 * Get all organization IDs that a user is a member of
 * Used for pre-fetching permissions in parallel with ticket queries
 *
 * @param userId - The user ID to get organization memberships for
 * @returns Array of organization IDs
 */
const getUserOrgIds = async (userId: string): Promise<string[]> => {
  const { data: members } = await tryCatch(() =>
    prisma.member.findMany({
      where: { userId },
      select: { organizationId: true },
    }),
  );

  if (!members) {
    return [];
  }

  return members.map((m) => m.organizationId);
};

export { getUserOrgIds };
