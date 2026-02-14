"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { auth } from "@/lib/auth";
import { organisationsPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { invalidateOrganisationsForUser } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const leaveOrganisationSchema = object({
  organizationId: pipe(string(), minLength(1)),
});

const leaveOrganisation = async (
  organizationId: string,
  _prevState: ActionState,
): Promise<ActionState> => {
  const result = safeParse(leaveOrganisationSchema, { organizationId });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const user = await getUserOrRedirect();

  const { error } = await tryCatch(async () =>
    auth.api.leaveOrganization({
      body: {
        organizationId: result.output.organizationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    const message =
      (error as Error)?.message?.includes("last member") ||
      (error as Error)?.message?.includes("Cannot remove")
        ? "Cannot leave as the last member of an organization"
        : "Failed to leave organization";

    return toActionState(message, "ERROR");
  }

  invalidateOrganisationsForUser(user.id);
  refresh();
  await setCookieByKey("toast", "Left organization successfully");
  redirect(organisationsPath());
};

export { leaveOrganisation };
