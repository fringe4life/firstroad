"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  email,
  maxLength,
  minLength,
  object,
  parse,
  pipe,
  string,
} from "valibot";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const signInSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    maxLength(191),
  ),
  password: pipe(string(), minLength(6), maxLength(191)),
});

const signin = async (_state: ActionState | undefined, formData: FormData) => {
  const { error } = await tryCatch(async () => {
    const formDataObj = Object.fromEntries(formData);

    const { email: userEmail, password } = parse(signInSchema, formDataObj);

    await auth.api.signInEmail({
      body: {
        email: userEmail,
        password,
      },
      headers: await headers(),
    });
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  // Redirect after successful authentication
  redirect(homePath);
};

export { signin };
