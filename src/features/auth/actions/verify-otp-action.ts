"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  email,
  examples,
  length,
  minLength,
  object,
  pipe,
  regex,
  safeParse,
  string,
} from "valibot";
import { auth } from "@/lib/auth";
import { accountProfilePath, ticketsPath } from "@/path";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { userExists } from "../queries/user-exists";

// Simplified schema for email + OTP validation
const otpSchema = object({
  email: pipe(string(), email(), minLength(1, "Email is required")),
  otp: pipe(
    string(),
    length(6, "OTP must be exactly 6 digits"),
    regex(/^\d{6}$/, "OTP must contain only numbers"),
    examples(["123456", "789012"]),
  ),
});

const verifyEmailVerificationOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Parse email and OTP first
  const result = safeParse(otpSchema, formDataObject);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  // Check if user exists to prevent email enumeration
  const { data: exists, error: dbError } = await tryCatch(async () =>
    userExists(result.output.email),
  );

  if (dbError || !exists) {
    return toActionState("Something went wrong", "ERROR", formData);
  }

  const { error } = await tryCatch(async () => {
    // For email verification, use the verify email endpoint
    await auth.api.verifyEmailOTP({
      body: {
        email: result.output.email,
        otp: result.output.otp,
      },
      headers: await headers(),
    });

    // Redirect to account profile
    throw redirect(accountProfilePath());
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(new Error("Something went wrong"), formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP verified successfully", "SUCCESS");
};

const verifySignInOTP = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const formDataObject = Object.fromEntries(formData.entries());

  // Parse email and OTP first
  const result = safeParse(otpSchema, formDataObject);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  // Check if user exists to prevent email enumeration
  const { data: exists, error: dbError } = await tryCatch(async () =>
    userExists(result.output.email),
  );

  if (dbError || !exists) {
    return toActionState("Something went wrong", "ERROR", formData);
  }

  const { error } = await tryCatch(async () => {
    // For sign-in, use the sign-in endpoint
    await auth.api.signInEmailOTP({
      body: {
        email: result.output.email,
        otp: result.output.otp,
      },
      headers: await headers(),
    });

    // Redirect to tickets page
    throw redirect(ticketsPath());
  });

  if (error) {
    unstable_rethrow(error);
    return fromErrorToActionState(new Error("Something went wrong"), formData);
  }

  // This should never be reached due to redirect, but satisfies TypeScript
  return toActionState("OTP verified successfully", "SUCCESS");
};

export { verifyEmailVerificationOTP, verifySignInOTP };
