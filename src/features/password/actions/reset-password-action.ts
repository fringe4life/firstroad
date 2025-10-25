"use server";

import { headers } from "next/headers";
import {
  forward,
  maxLength,
  minLength,
  object,
  parse,
  partialCheck,
  pipe,
  string,
} from "valibot";
import { auth } from "@/lib/auth";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const resetPasswordSchema = pipe(
  object({
    token: pipe(string(), minLength(1, "Token is required")),
    password: pipe(
      string(),
      minLength(6, "Password must be at least 6 characters"),
      maxLength(191),
    ),
    confirmPassword: pipe(
      string(),
      minLength(1, "Please confirm your password"),
    ),
  }),
  forward(
    partialCheck(
      [["password"], ["confirmPassword"]],
      (data) => data.password === data.confirmPassword,
      "Passwords don't match",
    ),
    ["confirmPassword"],
  ),
);

const resetPassword = async (
  _state: ActionState | undefined,
  formData: FormData,
) => {
  const { error } = await tryCatch(async () => {
    const formDataObj = Object.fromEntries(formData);
    const { token, password } = parse(resetPasswordSchema, formDataObj);

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
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }
};

export { resetPassword };
