import { z } from "zod/v4";
import { sendWelcomeEmail } from "@/features/auth/utils/send-welcome-email";
import { inngest } from "@/lib/inngest";

const welcomeEmailSchema = z.object({
  email: z.email(),
  userName: z.string().optional(),
});

export type WelcomeEmailEventData = z.infer<typeof welcomeEmailSchema>;

export const eventWelcomeEmail = inngest.createFunction(
  {
    id: "event-welcome-email",
    retries: 3,
  },
  {
    event: "user.welcome",
    step: {
      delay: "2m", // Wait 2 minutes before sending
    },
  },
  async ({ event }) => {
    const result = welcomeEmailSchema.safeParse(event.data);
    if (!result.success) {
      throw new Error("Invalid welcome email event data");
    }

    const { email, userName } = result.data;

    await sendWelcomeEmail(email, userName);
  },
);
