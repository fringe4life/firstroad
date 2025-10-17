import { z } from "zod/v4";
import { sendEmailVerification } from "@/features/auth/utils/send-email-verification";
import { inngest } from "@/lib/inngest";

const emailVerificationSchema = z.object({
  email: z.email(),
  verificationUrl: z.url(),
  userName: z.string().optional(),
});

export const eventEmailVerification = inngest.createFunction(
  { id: "event-email-verification" },
  { event: "email.verification" },
  async ({ event }) => {
    const result = emailVerificationSchema.safeParse(event.data);
    if (!result.success) {
      throw new Error("Invalid email verification event data");
    }

    const { email, verificationUrl, userName } = result.data;

    await sendEmailVerification(email, verificationUrl, userName);
  },
);
