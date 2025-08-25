"use server";

import { headers } from "next/headers";
import { z } from "zod";
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
  console.log("🚀 Forgot password process started");
  console.log("📅 Timestamp:", new Date().toISOString());

  try {
    console.log("📝 Parsing form data...");
    const formDataObj = Object.fromEntries(formData);
    console.log("📋 Form data received:", {
      email: formDataObj.email,
      formDataKeys: Array.from(formData.keys()),
    });

    const { email } = forgotPasswordSchema.parse(formDataObj);
    console.log("✅ Form data validation passed");
    console.log("📧 Email being processed:", email);

    console.log("🔑 Attempting to request password reset with Better Auth...");

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password`,
      },
      headers: await headers(),
    });

    console.log("✅ Password reset email sent successfully");
    return toActionState(
      "If an account with that email exists, a password reset link has been sent.",
      "SUCCESS",
    );
  } catch (err: unknown) {
    console.log("💥 Error during forgot password process:", err);
    console.log("💥 Error type:", typeof err);
    console.log(
      "💥 Error message:",
      err instanceof Error ? err.message : String(err),
    );

    return fromErrorToActionState(err, formData);
  }
};

export { forgotPassword };
