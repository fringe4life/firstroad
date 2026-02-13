import { prisma } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { ResourcePermission, ResourceType } from "../types";

const getMemberPermission = async (
  userId: string,
  organizationId: string,
  resourceType: ResourceType,
): Promise<Maybe<ResourcePermission>> => {
  const { data: permission } = await tryCatch(() =>
    prisma.memberPermission.findFirst({
      where: {
        member: {
          userId,
          organizationId,
        },
        resourceType,
      },
      select: {
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      },
    }),
  );

  return permission;
};

export { getMemberPermission };
