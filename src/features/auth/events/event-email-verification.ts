import {
  email,
  type InferOutput,
  object,
  optional,
  parse,
  pipe,
  string,
  url,
} from "valibot";
import { sendEmailVerification } from "@/features/auth/utils/send-email-verification";
import { inngest } from "@/lib/inngest";

const emailVerificationSchema = object({
  email: pipe(string(), email()),
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
    try {
      const {
        email: userEmail,
        verificationUrl,
        userName,
      } = parse(emailVerificationSchema, event.data);
      await sendEmailVerification(userEmail, verificationUrl, userName);
    } catch {
      throw new Error("Invalid email verification event data");
    }
  },
);
