import { eventType } from "inngest";
import { email, examples, minLength, object, pipe, string, url } from "valibot";
import { sendPasswordResetEmail } from "@/features/password/utils/send-password-reset-email";
import { inngest } from "@/lib/inngest";
import { tryCatch } from "@/utils/try-catch";

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

export const passwordReset = eventType("password.reset", {
  schema: passwordResetSchema,
});

export const eventPasswordReset = inngest.createFunction(
  { id: "event-password-reset", triggers: [passwordReset] },
  async ({ event }) => {
    const { email: userEmail, resetUrl, userName } = event.data;
    const { error } = await tryCatch(() =>
      sendPasswordResetEmail(userEmail, resetUrl, userName),
    );
    if (error) {
      throw new Error("Invalid password reset event data");
    }
  },
);
