import {
  email,
  examples,
  type InferOutput,
  minLength,
  object,
  optional,
  parse,
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

export type EmailVerificationEventData = InferOutput<
  typeof emailVerificationSchema
>;

export const eventEmailVerification = inngest.createFunction(
  { id: "event-email-verification" },
  { event: "email.verification" },
  async ({ event }) => {
    const { data: parsed } = await tryCatch(async () =>
      parse(emailVerificationSchema, event.data),
    );
    if (!parsed) {
      throw new Error("Invalid email verification event data");
    }

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
