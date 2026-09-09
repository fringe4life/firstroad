import { orm } from "@firstroad/db";
import type { List } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import {
  DEFAULT_CREATE_PERMISSION,
  DEFAULT_ITEM_PERMISSION,
} from "../constants";
import type {
  OrganisationMemberRow,
  ResourcePermission,
  ResourceType,
} from "../types";

const getMembershipsById = async (
  id: string,
): Promise<List<OrganisationMemberRow>> => {
  const { data: members } = await tryCatch(async () => {
    const rows = await orm.Member.where({ organizationId: id })
      .orderBy((member) => member.createdAt.desc())
      .include("user", (user) => user.select("email", "emailVerified", "name"))
      .include("permissions", (permission) =>
        permission.select(
          "canCreate",
          "canDelete",
          "canUpdate",
          "resourceType",
        ),
      )
      .all();

    return rows.map((member) => {
      const permissionsByType = Object.fromEntries(
        member.permissions.map((permission) => [
          permission.resourceType,
          {
            canCreate: permission.canCreate,
            canDelete: permission.canDelete,
            canUpdate: permission.canUpdate,
          } satisfies ResourcePermission,
        ]),
      ) as Record<ResourceType, ResourcePermission>;

      return {
        email: member.user.email,
        emailVerified: member.user.emailVerified,
        id: member.id,
        joinedAt: new Date(member.createdAt),
        name: member.user.name,
        permissions: {
          COMMENT:
            permissionsByType.COMMENT ??
            ({
              ...DEFAULT_CREATE_PERMISSION,
              ...DEFAULT_ITEM_PERMISSION,
            } satisfies ResourcePermission),
          TICKET:
            permissionsByType.TICKET ??
            ({
              ...DEFAULT_CREATE_PERMISSION,
              ...DEFAULT_ITEM_PERMISSION,
            } satisfies ResourcePermission),
        },
        role: member.role,
      } satisfies OrganisationMemberRow;
    });
  });

  return members ?? [];
};

export { getMembershipsById };
