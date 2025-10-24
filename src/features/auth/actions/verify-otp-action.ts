"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ticketsPath } from "src/path";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { isRedirectError } from "@/utils/is-redirect-error";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

// Simplified schema for email + OTP validation
const otpSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export const verifyEmailVerificationOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Validate form data with simplified schema
  const parsed = otpSchema.safeParse(formDataObject);

  if (!parsed.success) {
    return fromErrorToActionState(parsed.error, formData);
  }

  const { error } = await tryCatch(async () => {
    // For email verification, use the verify email endpoint
    await auth.api.verifyEmailOTP({
      body: {
        email: parsed.data.email,
        otp: parsed.data.otp,
      },
      headers: await headers(),
    });

    // Redirect to account profile
    throw redirect(ticketsPath);
  });

  if (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return fromErrorToActionState(error, formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP verified successfully", "SUCCESS");
};

export const verifySignInOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Validate form data with simplified schema
  const parsed = otpSchema.safeParse(formDataObject);

  if (!parsed.success) {
    return fromErrorToActionState(parsed.error, formData);
  }

  const { error } = await tryCatch(async () => {
    // For sign-in, use the sign-in endpoint
    await auth.api.signInEmailOTP({
      body: {
        email: parsed.data.email,
        otp: parsed.data.otp,
      },
      headers: await headers(),
    });

    // Redirect to tickets page
    throw redirect(ticketsPath);
  });

  if (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return fromErrorToActionState(error, formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP verified successfully", "SUCCESS");
};
