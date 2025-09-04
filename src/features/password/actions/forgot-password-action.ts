"use server";

import { headers } from "next/headers";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { auth } from "@/lib/auth";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }).max(191),
});

const forgotPassword = async (
  _state: ActionState | undefined,
  formData: FormData,
) => {
  try {
    const formDataObj = Object.fromEntries(formData);
    const { email } = forgotPasswordSchema.parse(formDataObj);

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password`,
      },
      headers: await headers(),
    });

    return toActionState(
      "If an account with that email exists, a password reset link has been sent.",
      "SUCCESS",
    );
  } catch (err: unknown) {
    return fromErrorToActionState(err, formData);
  }
};

export { forgotPassword };
