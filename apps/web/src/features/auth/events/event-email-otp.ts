import { eventType } from "inngest";
import {
  email,
  examples,
  type InferOutput,
  literal,
  maxLength,
  minLength,
  object,
  optional,
  pipe,
  string,
  union,
} from "valibot";
import { sendEmailOTP } from "@/features/auth/utils/send-email-otp";
import { inngest } from "@/lib/inngest";
import { tryCatch } from "@/utils/try-catch";

const MIN_OTP_LENGTH = 4;
const MAX_OTP_LENGTH = 8;

const emailOTPSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    examples(["bob@gmail.com", "alice@yahoo.com", "john@protonmail.com"]),
  ),
  otp: pipe(string(), minLength(MIN_OTP_LENGTH), maxLength(MAX_OTP_LENGTH)),
  type: union([
    literal("sign-in"),
    literal("email-verification"),
    literal("forget-password"),
  ]),
  userName: optional(string()),
});

export type EmailOTPEventData = InferOutput<typeof emailOTPSchema>;

export const emailOTP = eventType("email.otp", {
  schema: emailOTPSchema,
});

export const eventEmailOTP = inngest.createFunction(
  { id: "event-email-otp", triggers: [emailOTP] },
  async ({ event }) => {
    const parsed = event.data;
    const { error: sendError } = await tryCatch(async () =>
      sendEmailOTP(parsed.email, parsed.otp, parsed.type, parsed.userName),
    );
    if (sendError) {
      throw new Error("Invalid email OTP event data");
    }
  },
);
