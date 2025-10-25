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
    try {
      const {
        email: userEmail,
        otp,
        type,
        userName,
      } = parse(emailOTPSchema, event.data);
      await sendEmailOTP(userEmail, otp, type, userName);
    } catch {
      throw new Error("Invalid email OTP event data");
    }
  },
);
