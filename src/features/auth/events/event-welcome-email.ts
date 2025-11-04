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
import { tryCatch } from "@/utils/try-catch";

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
    const { data: parsed } = await tryCatch(async () =>
      parse(welcomeEmailSchema, event.data),
    );
    if (!parsed) {
      throw new Error("Invalid welcome email event data");
    }

    const { error: sendError } = await tryCatch(async () =>
      sendWelcomeEmail(parsed.email, parsed.userName),
    );
    if (sendError) {
      throw new Error("Invalid welcome email event data");
    }
  },
);
