"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { minLength, object, pipe, safeParse, string } from "valibot";
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
  memberId: pipe(string(), minLength(1)),
  organizationId: pipe(string(), minLength(1)),
});

const removeMember = async (
  organizationId: string,
  memberId: string,
  _prevState: ActionState<null>,
): Promise<ActionState<null>> => {
  const { user } = await getAdminOwnerOrRedirect(organizationId);

  const result = safeParse(removeMemberSchema, {
    memberId,
    organizationId,
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { error } = await tryCatch(async () =>
    auth.api.removeMember({
      body: {
        memberIdOrEmail: result.output.memberId,
        organizationId: result.output.organizationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    const message =
      errorMessage.includes("last member") ||
      errorMessage.includes("Cannot remove")
        ? "Cannot remove the last member from an organization"
        : "Failed to remove member";

    return toActionState(message, "ERROR");
  }

  invalidateOrganisationsForUser(user.id);

  refresh();
  return toActionState("Member removed successfully", "SUCCESS");
};

export { removeMember };
