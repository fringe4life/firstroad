"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { isAdminOrOwner } from "@/features/organisation/utils/admin";
import { auth } from "@/lib/auth";
import { organisationPath, organisationsPath } from "@/path";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const acceptInvitationSchema = object({
  invitationId: pipe(string(), minLength(1, "Invitation ID is required")),
});

const acceptInvitation = async (
  invitationId: string,
  _prevState: ActionState,
): Promise<ActionState> => {
  // Validate input first
  const result = safeParse(acceptInvitationSchema, { invitationId });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { data, error } = await tryCatch(async () =>
    auth.api.acceptInvitation({
      body: {
        invitationId: result.output.invitationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  // Redirect to the organisation page on success
  // Admins/owners go to the specific org, members go to the list
  if (data?.member?.organizationId && isAdminOrOwner(data.member)) {
    redirect(organisationPath(data.member.organizationId));
  }

  redirect(organisationsPath());
};

export { acceptInvitation };
