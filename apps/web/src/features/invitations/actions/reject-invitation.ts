"use server";

import { orm } from "@firstroad/db";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";
import { invalidateInvitationsForOrganization } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const rejectInvitationSchema = object({
  invitationId: pipe(string(), minLength(1, "Invitation ID is required")),
});

const rejectInvitation = async (
  invitationId: string,
  _prevState: ActionState,
): Promise<ActionState> => {
  const result = safeParse(rejectInvitationSchema, { invitationId });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { error } = await tryCatch(async () =>
    auth.api.rejectInvitation({
      body: {
        invitationId: result.output.invitationId,
      },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  const invitation = await orm.Invitation.where({
    id: result.output.invitationId,
  })
    .select("organizationId")
    .first();
  if (invitation) {
    invalidateInvitationsForOrganization(invitation.organizationId);
  }

  refresh();

  redirect(homePath());
};

export { rejectInvitation };
