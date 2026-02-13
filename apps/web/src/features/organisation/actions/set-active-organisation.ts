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

const setActiveOrganisationSchema = object({
  organizationId: pipe(string(), minLength(1)),
});

const setActiveOrganisation = async (
  organizationId: string,
  _prevState: ActionState<string>,
): Promise<ActionState<string>> => {
  const result = safeParse(setActiveOrganisationSchema, { organizationId });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const user = await getUserOrRedirect({ checkActiveOrganisation: false });

  const { error } = await tryCatch(async () =>
    auth.api.setActiveOrganization({
      body: { organizationId: result.output.organizationId },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  if (user?.id) {
    invalidateOrganisationsForUser(user.id);
  }

  refresh();

  return toActionState(
    "Organisation switched",
    "SUCCESS",
    undefined,
    organizationId,
  );
};

export { setActiveOrganisation };
