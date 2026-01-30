"use server";

import {
  boolean,
  minLength,
  object,
  picklist,
  pipe,
  safeParse,
  string,
} from "valibot";
import { prisma } from "@/lib/prisma";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { getAdminOwnerOrRedirect } from "../queries/get-admin-owner-or-redirect";
import type { PermissionKey } from "../types";

const togglePermissionSchema = object({
  memberId: pipe(string(), minLength(1)),
  organizationId: pipe(string(), minLength(1)),
  permissionKey: picklist(["canDeleteTicket"]),
  permissionValue: boolean(),
});

const togglePermission = async (
  memberId: string,
  organizationId: string,
  permissionKey: PermissionKey,
  permissionValue: boolean,
  _prevState: ActionState<boolean>,
): Promise<ActionState<boolean>> => {
  await getAdminOwnerOrRedirect(organizationId);

  const result = safeParse(togglePermissionSchema, {
    memberId,
    organizationId,
    permissionKey,
    permissionValue,
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { error } = await tryCatch(async () => {
    await prisma.member.update({
      where: { id: result.output.memberId },
      data: {
        [result.output.permissionKey]: result.output.permissionValue,
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
