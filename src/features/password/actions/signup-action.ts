"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/features/utils/to-action-state";
import { auth } from "@/lib/auth";
import { isRedirectError } from "@/lib/is-redirect-error";
import { ticketsPath } from "@/path";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).max(191),
    email: z.email().min(1, { message: "Email is required" }).max(191),
    password: z.string().min(6).max(191),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This will show the error on the confirmPassword field
  });

const signup = async (_state: ActionState | undefined, formData: FormData) => {
  try {
    const formDataObj = Object.fromEntries(formData);
    const { name, email, password } = signUpSchema.parse(formDataObj);

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    redirect(ticketsPath);
  } catch (err: unknown) {
    if (isRedirectError(err)) throw err;
    return fromErrorToActionState(err, formData);
  }
};

export { signup };
