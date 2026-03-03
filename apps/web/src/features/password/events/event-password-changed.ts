import { eventType } from "inngest";
import {
  email,
  type InferOutput,
  object,
  optional,
  pipe,
  string,
} from "valibot";
import { sendPasswordChangedEmail } from "@/features/auth/utils/send-password-changed-email";
import { inngest } from "@/lib/inngest";
import { tryCatch } from "@/utils/try-catch";

const passwordChangedSchema = object({
  email: pipe(string(), email()),
  userName: optional(string()),
});

export type PasswordChangedEventData = InferOutput<
  typeof passwordChangedSchema
>;

export const passwordChanged = eventType("password.changed", {
  schema: passwordChangedSchema,
});

export const eventPasswordChanged = inngest.createFunction(
  { id: "event-password-changed", triggers: [passwordChanged] },
  async ({ event }) => {
    const { email: userEmail, userName } = event.data;
    const { error } = await tryCatch(() =>
      sendPasswordChangedEmail(userEmail, userName),
    );

    if (error) {
      throw new Error("Invalid password changed event data");
    }
  },
);
