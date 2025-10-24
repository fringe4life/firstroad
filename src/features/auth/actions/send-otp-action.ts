"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { setCookieByKey } from "@/utils/cookies";
import { isRedirectError } from "@/utils/is-redirect-error";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

// Simplified schema for email-only validation
const emailSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
});

export const sendEmailVerificationOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Validate form data with simplified schema
  const parsed = emailSchema.safeParse(formDataObject);

  if (!parsed.success) {
    return fromErrorToActionState(parsed.error, formData);
  }

  const { error } = await tryCatch(async () => {
    await auth.api.sendVerificationOTP({
      body: {
        email: parsed.data.email,
        type: "email-verification",
      },
      headers: await headers(),
    });

    // Set toast cookie to show success message
    await setCookieByKey("toast", "Verification code sent to your email");

    // Redirect to verify page with email in URL
    const verifyUrl = `/verify-email/otp/verify?email=${encodeURIComponent(parsed.data.email)}`;
    throw redirect(verifyUrl as `/verify-email/otp/verify?email=${string}`);
  });

  if (error) {
    if (isRedirectError(error)) {
      throw error;
    }
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

  // Validate form data with simplified schema
  const parsed = emailSchema.safeParse(formDataObject);

  if (!parsed.success) {
    return fromErrorToActionState(parsed.error, formData);
  }

  const { error } = await tryCatch(async () => {
    await auth.api.sendVerificationOTP({
      body: {
        email: parsed.data.email,
        type: "sign-in",
      },
      headers: await headers(),
    });

    // Set toast cookie to show success message
    await setCookieByKey("toast", "Verification code sent to your email");

    // Redirect to verify page with email in URL
    const verifyUrl = `/sign-in/otp/verify?email=${encodeURIComponent(parsed.data.email)}`;
    throw redirect(verifyUrl as `/sign-in/otp/verify?email=${string}`);
  });

  if (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return fromErrorToActionState(error, formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP sent successfully", "SUCCESS");
};
