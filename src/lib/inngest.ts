import { EventSchemas, Inngest } from "inngest";
import type { EmailVerificationEventData } from "src/features/auth/events/event-email-verification";
import type { PasswordResetEventData } from "src/features/password/events/event-password-reset";

// Define the event schemas for Inngest
export type Events = {
  "password.reset": {
    data: PasswordResetEventData;
  };
  "email.verification": {
    data: EmailVerificationEventData;
  };
};

// Create a client to send and receive events with type-safe event schemas
export const inngest = new Inngest({
  id: "firstroad",
  schemas: new EventSchemas().fromRecord<Events>(),
});
