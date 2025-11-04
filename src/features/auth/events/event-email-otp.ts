import {
  email,
  type InferOutput,
  literal,
  maxLength,
  minLength,
  object,
  optional,
  parse,
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
  email: pipe(string(), email()),
  otp: pipe(string(), minLength(MIN_OTP_LENGTH), maxLength(MAX_OTP_LENGTH)),
  type: union([
    literal("sign-in"),
    literal("email-verification"),
    literal("forget-password"),
  ]),
  userName: optional(string()),
});

export type EmailOTPEventData = InferOutput<typeof emailOTPSchema>;

export const eventEmailOTP = inngest.createFunction(
  { id: "event-email-otp" },
  { event: "email.otp" },
  async ({ event }) => {
    const { data: parsed } = await tryCatch(async () =>
      parse(emailOTPSchema, event.data),
    );
    if (!parsed) {
      throw new Error("Invalid email OTP event data");
    }

    const { error: sendError } = await tryCatch(async () =>
      sendEmailOTP(parsed.email, parsed.otp, parsed.type, parsed.userName),
    );
    if (sendError) {
      throw new Error("Invalid email OTP event data");
    }
  },
);
