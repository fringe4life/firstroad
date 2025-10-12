import { serve } from "inngest/next";
import { eventPasswordReset } from "src/features/password/events/event-password-reset";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [eventPasswordReset],
});
