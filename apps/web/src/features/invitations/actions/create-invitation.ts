"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { email, object, picklist, pipe, safeParse, string } from "valibot";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";
import { auth } from "@/lib/auth";
import { invitationsPath } from "@/path";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const createInvitationSchema = object({
  email: pipe(string(), email()),
  role: picklist(["member", "admin"]),
});

const createInvitation = async (
  organizationId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  // Validate input first
  const result = safeParse(
    createInvitationSchema,
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  // Authenticate and authorize inside the action
  await getAdminOwnerOrRedirect(organizationId);

  const { error } = await tryCatch(async () =>
    auth.api.createInvitation({
      body: {
        email: result.output.email,
        role: result.output.role,
        organizationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  // Refresh the invitations list
  revalidatePath(invitationsPath(organizationId));

  return toActionState("Invitation sent", "SUCCESS");
};

export { createInvitation };
