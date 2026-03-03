import { eventType } from "inngest";
import {
  email,
  examples,
  type InferOutput,
  minLength,
  object,
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
  userName: pipe(string(), minLength(1, "User name is required")),
});

export type PasswordResetEventData = InferOutput<typeof passwordResetSchema>;

export const passwordReset = eventType("password.reset", {
  schema: passwordResetSchema,
});

export const eventPasswordReset = inngest.createFunction(
  { id: "event-password-reset", triggers: [passwordReset] },
  async ({ event }) => {
    try {
      const { email: userEmail, resetUrl, userName } = event.data;
      await sendPasswordResetEmail(userEmail, resetUrl, userName);
    } catch {
      throw new Error("Invalid password reset event data");
    }
  },
);
