"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  email,
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
import { homePath } from "@/path";
import { isRedirectError } from "@/utils/is-redirect-error";
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
  const { error } = await tryCatch(async () => {
    const formDataObj = Object.fromEntries(formData);
    const {
      name,
      email: userEmail,
      password,
    } = parse(signUpSchema, formDataObj);

    await auth.api.signUpEmail({
      body: {
        name,
        email: userEmail,
        password,
      },
      headers: await headers(),
    });

    throw redirect(homePath);
  });

  if (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return fromErrorToActionState(error, formData);
  }
};

export { signup };
