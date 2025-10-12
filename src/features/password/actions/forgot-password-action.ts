"use server";

import { inngest } from "src/lib/inngest";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }).max(191),
});

const forgotPassword = async (
  _state: ActionState | undefined,
  formData: FormData,
) => {
  const { error } = await tryCatch(async () => {
    const formDataObj = Object.fromEntries(formData);
    const { email } = forgotPasswordSchema.parse(formDataObj);

    const user = await prisma?.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return toActionState("Check your email for a reset link", "SUCCESS");
    }

    await inngest.send({
      name: "password.reset",
      data: {
        userId: user?.id,
      },
    });

    return toActionState(
      "If an account with that email exists, a password reset link has been sent.",
      "SUCCESS",
    );
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }
};

export { forgotPassword };
