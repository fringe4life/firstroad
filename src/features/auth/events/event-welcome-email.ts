import {
  email,
  type InferOutput,
  object,
  optional,
  parse,
  pipe,
  string,
} from "valibot";
import { sendWelcomeEmail } from "@/features/auth/utils/send-welcome-email";
import { inngest } from "@/lib/inngest";

const welcomeEmailSchema = object({
  email: pipe(string(), email()),
  userName: optional(string()),
});

export type WelcomeEmailEventData = InferOutput<typeof welcomeEmailSchema>;

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
    try {
      const { email: userEmail, userName } = parse(
        welcomeEmailSchema,
        event.data,
      );
      await sendWelcomeEmail(userEmail, userName);
    } catch {
      throw new Error("Invalid welcome email event data");
    }
  },
);
