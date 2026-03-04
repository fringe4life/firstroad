/** biome-ignore-all lint/style/noMagicNumbers: easy to understand zod schema */
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  forward,
  literal,
  minLength,
  object,
  optional,
  partialCheck,
  pipe,
  safeParse,
  string,
  transform,
  union,
} from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest";
import { accountProfilePath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

// Valibot schema for password change validation
const schema = pipe(
  object({
    // Current password field validation
    currentPassword: pipe(
      string(),
      minLength(8, "Current password is required"),
    ),
    // New password must be at least 8 characters
    newPassword: pipe(
      string(),
      minLength(8, "Password must be at least 8 characters"),
    ),
    // Confirm password field validation
    confirmPassword: pipe(
      string(),
      minLength(8, "Please confirm your password"),
    ),
    // Checkbox for revoking other sessions (transforms "on" to boolean, handles null)
    revokeOtherSessions: pipe(
      optional(union([literal("on"), literal("off")])),
      transform((v) => {
        if (v === "on") {
          return true;
        }
        if (v === "off") {
          return false;
        }
        return false;
      }),
    ),
  }),
  forward(
    partialCheck(
      [["newPassword"], ["confirmPassword"]],
      (data) => data.newPassword === data.confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
  forward(
    partialCheck(
      [["currentPassword"], ["newPassword"]],
      (data) => data.currentPassword !== data.newPassword,
      "New password must be different from current password",
    ),
    ["newPassword"],
  ),
);

export async function changePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const formDataObject = Object.fromEntries(formData.entries());

  // Validate form data with Valibot schema
  const parsed = safeParse(schema, formDataObject);

  if (!parsed.success) {
    return fromErrorToActionState(parsed.issues, formData);
  }
  const { confirmPassword, ...changePasswordBody } = parsed.output;

  const user = await getUserOrRedirect();
  const { error } = await tryCatch(async () => {
    await auth.api.changePassword({
      headers: await headers(),
      body: changePasswordBody,
    });

    await inngest.send({
      name: "password.changed",
      data: { email: user.email, userName: user.name },
    });
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Password successfully changed");
  redirect(accountProfilePath());
}
