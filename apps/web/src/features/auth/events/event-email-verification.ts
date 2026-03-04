import { eventType } from "inngest";
import {
  email,
  examples,
  minLength,
  object,
  optional,
  pipe,
  string,
  url,
} from "valibot";
import { sendEmailVerification } from "@/features/auth/utils/send-email-verification";
import { inngest } from "@/lib/inngest";
import { tryCatch } from "@/utils/try-catch";

const emailVerificationSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    examples(["bob@gmail.com", "alice@yahoo.com", "john@protonmail.com"]),
  ),
  verificationUrl: pipe(string(), url()),
  userName: optional(string()),
});

export const emailVerification = eventType("email.verification", {
  schema: emailVerificationSchema,
});

export const eventEmailVerification = inngest.createFunction(
  { id: "event-email-verification", triggers: [emailVerification] },
  async ({ event }) => {
    const parsed = event.data;

    const { error: sendError } = await tryCatch(async () =>
      sendEmailVerification(
        parsed.email,
        parsed.verificationUrl,
        parsed.userName,
      ),
    );
    if (sendError) {
      throw new Error("Invalid email verification event data");
    }
  },
);
