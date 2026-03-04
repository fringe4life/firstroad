import { eventType } from "inngest";
import {
  email,
  examples,
  minLength,
  object,
  optional,
  pipe,
  string,
} from "valibot";
import { sendWelcomeEmail } from "@/features/auth/utils/send-welcome-email";
import { inngest } from "@/lib/inngest";
import { tryCatch } from "@/utils/try-catch";

const welcomeEmailSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    examples(["bob@gmail.com", "alice@yahoo.com", "john@protonmail.com"]),
  ),
  userName: optional(string()),
});

export const welcomeEmail = eventType("user.welcome", {
  schema: welcomeEmailSchema,
});

export const eventWelcomeEmail = inngest.createFunction(
  {
    id: "event-welcome-email",
    retries: 3,
    triggers: [welcomeEmail],
  },
  async ({ event, step }) => {
    // Delay sending the welcome email by 2 minutes in a durable way
    await step.sleep("delay-welcome-email", "2m");

    const parsed = event.data;

    const { error: sendError } = await tryCatch(() =>
      sendWelcomeEmail(parsed.email, parsed.userName),
    );
    if (sendError) {
      throw new Error("Invalid welcome email event data");
    }
  },
);
