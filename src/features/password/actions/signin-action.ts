"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { ticketsPath } from "@/path";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const signInSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }).max(191),
  password: z.string().min(6).max(191),
});

const signin = async (_state: ActionState | undefined, formData: FormData) => {
  const { error } = await tryCatch(async () => {
    const formDataObj = Object.fromEntries(formData);

    const { email, password } = signInSchema.parse(formDataObj);

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  // Redirect after successful authentication
  redirect(ticketsPath);
};

export { signin };
