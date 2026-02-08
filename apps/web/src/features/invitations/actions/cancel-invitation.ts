"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";
import { auth } from "@/lib/auth";
import { invitationsPath } from "@/path";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const cancelInvitationSchema = object({
  organizationId: pipe(string(), minLength(1)),
  invitationId: pipe(string(), minLength(1)),
});

const cancelInvitation = async (
  organizationId: string,
  invitationId: string,
): Promise<ActionState> => {
  // Validate input first
  const result = safeParse(cancelInvitationSchema, {
    organizationId,
    invitationId,
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  // Authenticate and authorize inside the action (server-auth-actions pattern)
  await getAdminOwnerOrRedirect(organizationId);

  const { error } = await tryCatch(async () =>
    auth.api.cancelInvitation({
      body: {
        invitationId: result.output.invitationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  // Refresh the invitations list
  revalidatePath(invitationsPath(organizationId));

  return toActionState("Invitation cancelled", "SUCCESS");
};

export { cancelInvitation };
