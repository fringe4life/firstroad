import { orm } from "./prisma/db";

type ResourceType = "TICKET" | "COMMENT";

const DEFAULT_RESOURCE_TYPES: ResourceType[] = ["TICKET", "COMMENT"];

export const addMemberPermissions = async (
  memberId: string,
  resourceTypes: ResourceType[],
): Promise<void> => {
  if (resourceTypes.length === 0) {
    return;
  }

  const existing = await orm.MemberPermission.where({ memberId })
    .select("resourceType")
    .all();
  const have = new Set(existing.map((row) => row.resourceType));
  const missing = resourceTypes.filter(
    (resourceType) => !have.has(resourceType),
  );
  await Promise.all(
    missing.map((resourceType) =>
      orm.MemberPermission.create({
        canCreate: true,
        canDelete: true,
        canUpdate: true,
        memberId,
        resourceType,
      }),
    ),
  );
};

export const removeMemberPermissions = async (
  memberId: string,
  resourceTypes: ResourceType[],
): Promise<void> => {
  if (resourceTypes.length === 0) {
    return;
  }

  await orm.MemberPermission.where((permission) =>
    permission.memberId.eq(memberId),
  )
    .where((permission) => permission.resourceType.in(resourceTypes))
    .delete();
};

export { DEFAULT_RESOURCE_TYPES };
