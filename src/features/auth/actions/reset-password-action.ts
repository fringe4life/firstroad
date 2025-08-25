"use server";

import { headers } from "next/headers";
import { z } from "zod";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { auth } from "@/lib/auth";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(191),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const resetPassword = async (
  _state: ActionState | undefined,
  formData: FormData,
) => {
  console.log("🚀 Reset password process started");
  console.log("📅 Timestamp:", new Date().toISOString());

  try {
    console.log("📝 Parsing form data...");
    const formDataObj = Object.fromEntries(formData);
    console.log("📋 Form data received:", {
      hasToken: !!formDataObj.token,
      hasPassword: !!formDataObj.password,
      hasConfirmPassword: !!formDataObj.confirmPassword,
      formDataKeys: Array.from(formData.keys()),
    });

    const { token, password } = resetPasswordSchema.parse(formDataObj);
    console.log("✅ Form data validation passed");

    console.log("🔑 Attempting to reset password with Better Auth...");

    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
      headers: await headers(),
    });

    console.log("✅ Password reset completed successfully");
    return toActionState(
      "Password has been reset successfully. You can now sign in with your new password.",
      "SUCCESS",
    );
  } catch (err: unknown) {
    console.log("💥 Error during reset password process:", err);
    console.log("💥 Error type:", typeof err);
    console.log(
      "💥 Error message:",
      err instanceof Error ? err.message : String(err),
    );

    return fromErrorToActionState(err, formData);
  }
};

export { resetPassword };
