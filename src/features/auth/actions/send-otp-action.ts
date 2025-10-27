"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { email, minLength, object, parse, pipe, string } from "valibot";
import { auth } from "@/lib/auth";
import { setCookieByKey } from "@/utils/cookies";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

// Simplified schema for email-only validation
const emailSchema = object({
  email: pipe(string(), email(), minLength(1, "Email is required")),
});

export const sendEmailVerificationOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  const { error } = await tryCatch(async () => {
    const parsed = parse(emailSchema, formDataObject);
    await auth.api.sendVerificationOTP({
      body: {
        email: parsed.email,
        type: "email-verification",
      },
      headers: await headers(),
    });

    // Set toast cookie to show success message
    await setCookieByKey("toast", "Verification code sent to your email");

    // Redirect to verify page with email in URL
    const verifyUrl = `/verify-email/otp/verify?email=${encodeURIComponent(parsed.email)}`;
    throw redirect(verifyUrl as `/verify-email/otp/verify?email=${string}`);
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(error, formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP sent successfully", "SUCCESS");
};

export const sendSignInOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  const { error } = await tryCatch(async () => {
    const parsed = parse(emailSchema, formDataObject);
    await auth.api.sendVerificationOTP({
      body: {
        email: parsed.email,
        type: "sign-in",
      },
      headers: await headers(),
    });

    // Set toast cookie to show success message
    await setCookieByKey("toast", "Verification code sent to your email");

    // Redirect to verify page with email in URL
    const verifyUrl = `/sign-in/otp/verify?email=${encodeURIComponent(parsed.email)}`;
    throw redirect(verifyUrl as `/sign-in/otp/verify?email=${string}`);
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(error, formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP sent successfully", "SUCCESS");
};
