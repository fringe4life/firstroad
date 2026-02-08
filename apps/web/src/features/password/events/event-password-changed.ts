import {
  email,
  type InferOutput,
  object,
  optional,
  parse,
  pipe,
  string,
} from "valibot";
import { sendPasswordChangedEmail } from "@/features/auth/utils/send-password-changed-email";
import { inngest } from "@/lib/inngest";

const passwordChangedSchema = object({
  email: pipe(string(), email()),
  userName: optional(string()),
});

export type PasswordChangedEventData = InferOutput<
  typeof passwordChangedSchema
>;

export const eventPasswordChanged = inngest.createFunction(
  { id: "event-password-changed" },
  { event: "password.changed" },
  async ({ event }) => {
    try {
      const { email: userEmail, userName } = parse(
        passwordChangedSchema,
        event.data,
      );
      await sendPasswordChangedEmail(userEmail, userName);
    } catch {
      throw new Error("Invalid password changed event data");
    }
  },
);
