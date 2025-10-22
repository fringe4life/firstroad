import { z } from "zod/v4";
import { sendEmailOTP } from "@/features/auth/utils/send-email-otp";
import { inngest } from "@/lib/inngest";

const MIN_OTP_LENGTH = 4;
const MAX_OTP_LENGTH = 8;

const emailOTPSchema = z.object({
  email: z.email(),
  otp: z.string().min(MIN_OTP_LENGTH).max(MAX_OTP_LENGTH),
  type: z.enum(["sign-in", "email-verification", "forget-password"]),
  userName: z.string().optional(),
});

export type EmailOTPEventData = z.infer<typeof emailOTPSchema>;

export const eventEmailOTP = inngest.createFunction(
  { id: "event-email-otp" },
  { event: "email.otp" },
  async ({ event }) => {
    const result = emailOTPSchema.safeParse(event.data);
    if (!result.success) {
      throw new Error("Invalid email OTP event data");
    }

    const { email, otp, type, userName } = result.data;

    await sendEmailOTP(email, otp, type, userName);
  },
);
