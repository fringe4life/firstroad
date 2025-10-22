import { serve } from "inngest/next";
import { eventPasswordReset } from "src/features/password/events/event-password-reset";
import { eventEmailOTP } from "@/features/auth/events/event-email-otp";
import { eventEmailVerification } from "@/features/auth/events/event-email-verification";
import { eventWelcomeEmail } from "@/features/auth/events/event-welcome-email";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    eventEmailVerification,
    eventPasswordReset,
    eventEmailOTP,
    eventWelcomeEmail,
  ],
});
