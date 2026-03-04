"use server";

import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import {
  email,
  forward,
  maxLength,
  minLength,
  object,
  partialCheck,
  pipe,
  safeParse,
  string,
} from "valibot";
import { auth } from "@/lib/auth";
import { verifyEmailPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const signUpSchema = pipe(
  object({
    name: pipe(string(), minLength(1, "Name is required"), maxLength(191)),
    email: pipe(
      string(),
      email(),
      minLength(1, "Email is required"),
      maxLength(191),
    ),
    password: pipe(string(), minLength(6), maxLength(191)),
    confirmPassword: pipe(
      string(),
      minLength(1, "Please confirm your password"),
    ),
  }),
  forward(
    partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords don't match",
    ),
    ["confirmPassword"],
  ),
);

const signup = async (_state: ActionState | undefined, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData);
  const result = safeParse(signUpSchema, formDataObj);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }
  const { error } = await tryCatch(async () => {
    await auth.api.signUpEmail({
      body: {
        name: result.output.name,
        email: result.output.email,
        password: result.output.password,
      },
      headers: await headers(),
    });
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }
  await setCookieByKey("toast", "Signed up successfully");
  redirect(verifyEmailPath(), RedirectType.replace);
};

export { signup };
