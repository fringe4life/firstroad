import { prisma } from "@firstroad/db";
import type { List } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import { DEFAULT_PERMISSION } from "../constants";
import type {
  OrganisationMemberRow,
  ResourcePermission,
  ResourceType,
} from "../types";

const getMembershipsById = async (
  id: string,
): Promise<List<OrganisationMemberRow>> => {
  const { data: members } = await tryCatch(async () => {
    const rows = await prisma.member.findMany({
      where: { organizationId: id },
      select: {
        id: true,
        createdAt: true,
        role: true,
        permissions: {
          select: {
            resourceType: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            emailVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((member) => {
      const permissionsByType = Object.fromEntries(
        member.permissions.map((p) => [
          p.resourceType,
          {
            canCreate: p.canCreate,
            canUpdate: p.canUpdate,
            canDelete: p.canDelete,
          } satisfies ResourcePermission,
        ]),
      ) as Record<ResourceType, ResourcePermission>;

      return {
        id: member.id,
        permissions: {
          TICKET: permissionsByType.TICKET ?? DEFAULT_PERMISSION,
          COMMENT: permissionsByType.COMMENT ?? DEFAULT_PERMISSION,
        },
        email: member.user.email,
        emailVerified: member.user.emailVerified,
        joinedAt: member.createdAt,
        name: member.user.name,
        role: member.role,
      } satisfies OrganisationMemberRow;
    });
  });

  return members ?? [];
};

export { getMembershipsById };
