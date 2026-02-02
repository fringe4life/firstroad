import { serve } from "inngest/bun";
import { eventEmailOTP } from "@/features/auth/events/event-email-otp";
import { eventEmailVerification } from "@/features/auth/events/event-email-verification";
import { eventWelcomeEmail } from "@/features/auth/events/event-welcome-email";
import { eventOrganizationInvitation } from "@/features/invitations/events/event-organization-invitation";
import { eventPasswordChanged } from "@/features/password/events/event-password-changed";
import { eventPasswordReset } from "@/features/password/events/event-password-reset";
import { app } from "@/lib/app";
import { inngest } from "@/lib/inngest";

const functions = [
  eventEmailVerification,
  eventPasswordReset,
  eventEmailOTP,
  eventWelcomeEmail,
  eventPasswordChanged,
  eventOrganizationInvitation,
];

const handler = serve({
  client: inngest,
  functions,
});

export const inngestHandler = app.all(
  "/inngest",
  ({ request }) => handler(request),
  { detail: { tags: ["inngest"] } },
);
