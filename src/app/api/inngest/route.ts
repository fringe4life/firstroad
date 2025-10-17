import { serve } from "inngest/next";
import { eventPasswordReset } from "src/features/password/events/event-password-reset";
import { eventEmailVerification } from "@/features/auth/events/event-email-verification";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [eventEmailVerification, eventPasswordReset],
});
