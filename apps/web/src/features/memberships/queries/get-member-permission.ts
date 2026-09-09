import { orm } from "@firstroad/db";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { ResourcePermission, ResourceType } from "../types";

const getMemberPermission = async (
  userId: string,
  organizationId: string,
  resourceType: ResourceType,
): Promise<Maybe<ResourcePermission>> => {
  const { data: member } = await tryCatch(() =>
    orm.Member.where({ organizationId, userId })
      .include("permissions", (permission) =>
        permission
          .where({ resourceType })
          .select("canCreate", "canDelete", "canUpdate")
          .limit(1),
      )
      .first(),
  );

  return member?.permissions[0] ?? null;
};

export { getMemberPermission };
