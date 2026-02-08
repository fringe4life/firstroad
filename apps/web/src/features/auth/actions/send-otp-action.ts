"use server";

import type { Route } from "next";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  email,
  examples,
  minLength,
  object,
  pipe,
  safeParse,
  string,
} from "valibot";
import { userExists } from "@/features/auth/queries/user-exists";
import { auth } from "@/lib/auth";
import { signInOTPVerifyPath, verifyEmailOTPVerifyPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

// Simplified schema for email-only validation
const emailSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    examples(["bob@gmail.com", "alice@yahoo.com", "john@protonmail.com"]),
  ),
});

const sendEmailVerificationOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Parse email first
  const result = safeParse(emailSchema, formDataObject);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  // Check if user exists to prevent email enumeration
  const { data: exists, error: dbError } = await tryCatch(async () =>
    userExists(result.output.email),
  );

  if (dbError) {
    return toActionState("Something went wrong", "ERROR", formData);
  }

  const { error } = await tryCatch(async () => {
    // If user exists call verification function
    if (exists) {
      await auth.api.sendVerificationOTP({
        body: {
          email: result.output.email,
          type: "email-verification",
        },
        headers: await headers(),
      });
    }

    // proceed with the other steps
    // Set toast cookie to show success message
    await setCookieByKey("toast", "Verification code sent to your email");

    // Redirect to verify page with email in URL
    const verifyUrl = `${verifyEmailOTPVerifyPath()}?email=${encodeURIComponent(result.output.email)}`;
    throw redirect(verifyUrl as Route);
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(new Error("Something went wrong"), formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP sent successfully", "SUCCESS");
};

const sendSignInOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Parse email first
  const result = safeParse(emailSchema, formDataObject);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  // Check if user exists to prevent email enumeration
  const { data: exists, error: dbError } = await tryCatch(async () =>
    userExists(result.output.email),
  );

  if (dbError) {
    return toActionState("Something went wrong", "ERROR", formData);
  }

  const { error } = await tryCatch(async () => {
    // If user exists call verififcation function
    // This prevents email enumeration attacks
    if (exists) {
      await auth.api.sendVerificationOTP({
        body: {
          email: result.output.email,
          type: "sign-in",
        },
        headers: await headers(),
      });
    }

    // proceed with the other steps
    // Set toast cookie to show success message
    await setCookieByKey("toast", "Verification code sent to your email");

    // Redirect to verify page with email in URL
    const verifyUrl = `${signInOTPVerifyPath()}?email=${encodeURIComponent(result.output.email)}`;
    throw redirect(verifyUrl as Route);
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(new Error("Something went wrong"), formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP sent successfully", "SUCCESS");
};

export { sendEmailVerificationOTP, sendSignInOTP };
