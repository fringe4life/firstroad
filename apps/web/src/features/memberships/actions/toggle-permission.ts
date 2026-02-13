"use server";

import { prisma } from "@firstroad/db";
import {
  boolean,
  minLength,
  object,
  picklist,
  pipe,
  safeParse,
  string,
} from "valibot";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { getAdminOwnerOrRedirect } from "../queries/get-admin-owner-or-redirect";
import type { PermissionAction, ResourceType } from "../types";

const togglePermissionSchema = object({
  memberId: pipe(string(), minLength(1)),
  organizationId: pipe(string(), minLength(1)),
  resourceType: picklist(["TICKET", "COMMENT"] as const),
  action: picklist(["canCreate", "canUpdate", "canDelete"] as const),
  permissionValue: boolean(),
});

const togglePermission = async (
  memberId: string,
  organizationId: string,
  resourceType: ResourceType,
  action: PermissionAction,
  permissionValue: boolean,
  _prevState: ActionState<boolean>,
): Promise<ActionState<boolean>> => {
  await getAdminOwnerOrRedirect(organizationId);

  const result = safeParse(togglePermissionSchema, {
    memberId,
    organizationId,
    resourceType,
    action,
    permissionValue,
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { error } = await tryCatch(async () => {
    const {
      memberId: mid,
      resourceType: rt,
      action: act,
      permissionValue: pv,
    } = result.output;

    await prisma.memberPermission.upsert({
      where: {
        memberId_resourceType: {
          memberId: mid,
          resourceType: rt,
        },
      },
      create: {
        memberId: mid,
        resourceType: rt,
        canCreate: act === "canCreate" ? pv : true,
        canUpdate: act === "canUpdate" ? pv : true,
        canDelete: act === "canDelete" ? pv : true,
      },
      update: {
        [act]: pv,
      },
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState(
    "Permission updated",
    "SUCCESS",
    undefined,
    permissionValue,
  );
};

export { togglePermission };
