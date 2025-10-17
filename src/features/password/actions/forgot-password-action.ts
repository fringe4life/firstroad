"use server";

import { headers } from "next/headers";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }).max(191),
});

const forgotPassword = async (
  _state: ActionState | undefined,
  formData: FormData,
) => {
  const { error } = await tryCatch(async () => {
    const formDataObj = Object.fromEntries(formData);
    const { email } = forgotPasswordSchema.parse(formDataObj);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectTo = `${baseUrl}/reset-password`;

    // Use Better Auth's API to handle password reset
    // This will trigger the sendResetPassword callback which sends the Inngest event
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo,
      },
      headers: await headers(),
    });

    return toActionState(
      "If an account with that email exists, a password reset link has been sent.",
      "SUCCESS",
    );
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }
};

export { forgotPassword };
