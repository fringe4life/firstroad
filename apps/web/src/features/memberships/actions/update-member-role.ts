"use server";

import type { MemberRole } from "@firstroad/db/client-types";
import { headers } from "next/headers";
import { minLength, object, picklist, pipe, safeParse, string } from "valibot";
import { auth } from "@/lib/auth";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { getAdminOwnerOrRedirect } from "../queries/get-admin-owner-or-redirect";

const updateMemberRoleSchema = object({
  organizationId: pipe(string(), minLength(1)),
  memberId: pipe(string(), minLength(1)),
  role: picklist(["admin", "member"]),
});

const updateMemberRole = async (
  organizationId: string,
  memberId: string,
  role: MemberRole,
  _prevState: ActionState<MemberRole>,
): Promise<ActionState<MemberRole>> => {
  await getAdminOwnerOrRedirect(organizationId);

  const result = safeParse(updateMemberRoleSchema, {
    organizationId,
    memberId,
    role,
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { error } = await tryCatch(async () =>
    auth.api.updateMemberRole({
      body: {
        organizationId: result.output.organizationId,
        memberId: result.output.memberId,
        role: result.output.role,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("Member role updated", "SUCCESS", undefined, role);
};

export { updateMemberRole };
