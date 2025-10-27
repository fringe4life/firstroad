"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { homePath } from "src/path";
import {
  email,
  length,
  minLength,
  object,
  parse,
  pipe,
  regex,
  string,
} from "valibot";
import { auth } from "@/lib/auth";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

// Simplified schema for email + OTP validation
const otpSchema = object({
  email: pipe(string(), email(), minLength(1, "Email is required")),
  otp: pipe(
    string(),
    length(6, "OTP must be exactly 6 digits"),
    regex(/^\d{6}$/, "OTP must contain only numbers"),
  ),
});

export const verifyEmailVerificationOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  const { error } = await tryCatch(async () => {
    const parsed = parse(otpSchema, formDataObject);
    // For email verification, use the verify email endpoint
    await auth.api.verifyEmailOTP({
      body: {
        email: parsed.email,
        otp: parsed.otp,
      },
      headers: await headers(),
    });

    // Redirect to account profile
    throw redirect(homePath);
  });

  if (error) {
    unstable_rethrow(error);
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

  const { error } = await tryCatch(async () => {
    // For sign-in, use the sign-in endpoint
    const parsed = parse(otpSchema, formDataObject);
    await auth.api.signInEmailOTP({
      body: {
        email: parsed.email,
        otp: parsed.otp,
      },
      headers: await headers(),
    });

    // Redirect to tickets page
    throw redirect(homePath);
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(error, formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP verified successfully", "SUCCESS");
};
