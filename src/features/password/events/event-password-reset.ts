import { z } from "zod/v4";
import { sendPasswordResetEmail } from "@/features/password/utils/send-password-reset-email";
import { inngest } from "@/lib/inngest";

const passwordResetSchema = z.object({
  email: z.email(),
  resetUrl: z.url(),
  userName: z.string().optional(),
});

export const eventPasswordReset = inngest.createFunction(
  { id: "event-password-reset" },
  { event: "password.reset" },
  async ({ event }) => {
    const result = passwordResetSchema.safeParse(event.data);
    if (!result.success) {
      throw new Error("Invalid password reset event data");
    }

    const { email, resetUrl, userName } = result.data;

    await sendPasswordResetEmail(email, resetUrl, userName);
  },
);
