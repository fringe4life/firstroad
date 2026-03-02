"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";
import { auth } from "@/lib/auth";
import { invalidateOrganisationsForUser } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const deleteOrganisationSchema = object({
  organizationId: pipe(string(), minLength(1)),
});

const deleteOrganisation = async (
  organizationId: string,
  _prevState: ActionState,
): Promise<ActionState> => {
  await getAdminOwnerOrRedirect(organizationId);

  const result = safeParse(deleteOrganisationSchema, { organizationId });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const user = await getUserOrRedirect();

  const { error } = await tryCatch(async () =>
    auth.api.deleteOrganization({
      body: {
        organizationId: result.output.organizationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    return toActionState("Failed to delete organization", "ERROR");
  }

  if (user?.id) {
    invalidateOrganisationsForUser(user.id);
  }

  refresh();
  return toActionState("Organization deleted", "SUCCESS");
};

export { deleteOrganisation };
