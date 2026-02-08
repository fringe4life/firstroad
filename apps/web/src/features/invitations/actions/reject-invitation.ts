"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";
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

  // Redirect to home page after rejecting
  redirect(homePath());
};

export { rejectInvitation };
