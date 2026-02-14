"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { auth } from "@/lib/auth";
import { invalidateOrganisationsForUser } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { getAdminOwnerOrRedirect } from "../queries/get-admin-owner-or-redirect";

const removeMemberSchema = object({
  organizationId: pipe(string(), minLength(1)),
  memberId: pipe(string(), minLength(1)),
});

const removeMember = async (
  organizationId: string,
  memberId: string,
  _prevState: ActionState<null>,
): Promise<ActionState<null>> => {
  await getAdminOwnerOrRedirect(organizationId);

  const result = safeParse(removeMemberSchema, {
    organizationId,
    memberId,
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const user = await getUserOrRedirect();

  const { error } = await tryCatch(
    async () =>
      await auth.api.removeMember({
        body: {
          organizationId: result.output.organizationId,
          memberIdOrEmail: result.output.memberId,
        },
        headers: await headers(),
      }),
  );

  if (error) {
    const message =
      (error as Error)?.message?.includes("last member") ||
      (error as Error)?.message?.includes("Cannot remove")
        ? "Cannot remove the last member from an organization"
        : "Failed to remove member";

    return toActionState(message, "ERROR");
  }

  invalidateOrganisationsForUser(user.id);

  refresh();
  return toActionState("Member removed successfully", "SUCCESS");
};

export { removeMember };
