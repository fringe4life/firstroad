"use server";

import { headers } from "next/headers";
import { z } from "zod/v4";
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
  try {
    const formDataObj = Object.fromEntries(formData);
    const { token, password } = resetPasswordSchema.parse(formDataObj);

    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
      headers: await headers(),
    });

    return toActionState(
      "Password has been reset successfully. You can now sign in with your new password.",
      "SUCCESS",
    );
  } catch (err: unknown) {
    return fromErrorToActionState(err, formData);
  }
};

export { resetPassword };
