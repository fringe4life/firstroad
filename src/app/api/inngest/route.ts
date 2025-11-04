import { serve } from "inngest/next";
import { eventEmailOTP } from "@/features/auth/events/event-email-otp";
import { eventEmailVerification } from "@/features/auth/events/event-email-verification";
import { eventWelcomeEmail } from "@/features/auth/events/event-welcome-email";
import { eventPasswordChanged } from "@/features/password/events/event-password-changed";
import { eventPasswordReset } from "@/features/password/events/event-password-reset";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    eventEmailVerification,
    eventPasswordReset,
    eventEmailOTP,
    eventWelcomeEmail,
    eventPasswordChanged,
  ],
});
