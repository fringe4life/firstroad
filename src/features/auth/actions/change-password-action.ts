"use server";

import { headers } from "next/headers";
import { z } from "zod/v4";
import type { ActionState } from "@/features/utils/to-action-state";
import {
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { auth } from "@/lib/auth";

// Zod schema for password change validation
const schema = z
  .object({
    // Current password field validation
    currentPassword: z.string().min(1, "Current password is required"),
    // New password must be at least 8 characters
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    // Confirm password field validation
    confirmPassword: z.string().min(1, "Please confirm your password"),
    // Checkbox for revoking other sessions (transforms "on" to boolean, handles null)
    revokeOtherSessions: z
      .string()
      .optional()
      .nullable()
      .transform((v) => v === "on"),
  })
  // Custom validation: new password must match confirmation
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  // Custom validation: new password must be different from current
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export async function changePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Extract form data
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");
  const revokeOtherSessions = formData.get("revokeOtherSessions") || null; // Handle unchecked checkbox

  // Validate form data with Zod schema
  const parsed = schema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
    revokeOtherSessions,
  });

  if (!parsed.success) {
    return fromErrorToActionState(parsed.error, formData);
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: parsed.data.revokeOtherSessions,
      },
    });

    return toActionState("Password updated successfully", "SUCCESS");
  } catch (error: unknown) {
    return fromErrorToActionState(error, formData);
  }
}
