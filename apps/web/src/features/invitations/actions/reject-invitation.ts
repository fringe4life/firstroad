"use server";

import { prisma } from "@firstroad/db";
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
  // Validate input first
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

  // Invalidate invitations cache for the org (invitation was for that org)
  const invitation = await prisma.invitation.findUnique({
    where: { id: result.output.invitationId },
    select: { organizationId: true },
  });
  if (invitation) {
    invalidateInvitationsForOrganization(invitation.organizationId);
  }

  refresh();

  // Redirect to home page after rejecting
  redirect(homePath());
};

export { rejectInvitation };
