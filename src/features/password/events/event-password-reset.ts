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
import { sendPasswordResetEmail } from "@/features/password/utils/send-password-reset-email";
import { inngest } from "@/lib/inngest";

const passwordResetSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    examples(["bob@gmail.com", "alice@yahoo.com", "john@protonmail.com"]),
  ),
  resetUrl: pipe(string(), url()),
  userName: optional(string()),
});

export type PasswordResetEventData = InferOutput<typeof passwordResetSchema>;

export const eventPasswordReset = inngest.createFunction(
  { id: "event-password-reset" },
  { event: "password.reset" },
  async ({ event }) => {
    try {
      const {
        email: userEmail,
        resetUrl,
        userName,
      } = parse(passwordResetSchema, event.data);
      await sendPasswordResetEmail(userEmail, resetUrl, userName);
    } catch {
      throw new Error("Invalid password reset event data");
    }
  },
);
