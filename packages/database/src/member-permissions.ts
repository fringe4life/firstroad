import type { PrismaClient } from "../generated/prisma/client";

type ResourceType = "TICKET" | "COMMENT";

const DEFAULT_RESOURCE_TYPES: ResourceType[] = ["TICKET", "COMMENT"];

/**
 * Add MemberPermission records for given resource types with model defaults
 * (canCreate, canUpdate, canDelete = true). Skips resource types that already exist.
 */
export const addMemberPermissions = async (
  prisma: PrismaClient,
  memberId: string,
  resourceTypes: ResourceType[],
): Promise<void> => {
  if (resourceTypes.length === 0) {
    return;
  }

  await prisma.memberPermission.createMany({
    data: resourceTypes.map((resourceType) => ({
      memberId,
      resourceType,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    })),
    skipDuplicates: true,
  });
};

/**
 * Remove MemberPermission records for given resource types.
 */
export const removeMemberPermissions = async (
  prisma: PrismaClient,
  memberId: string,
  resourceTypes: ResourceType[],
): Promise<void> => {
  if (resourceTypes.length === 0) {
    return;
  }

  await prisma.memberPermission.deleteMany({
    where: {
      memberId,
      resourceType: { in: resourceTypes },
    },
  });
};

export { DEFAULT_RESOURCE_TYPES };
