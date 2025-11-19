import { EventSchemas, Inngest } from "inngest";
import type { EmailOTPEventData } from "@/features/auth/events/event-email-otp";
import type { EmailVerificationEventData } from "@/features/auth/events/event-email-verification";
import type { WelcomeEmailEventData } from "@/features/auth/events/event-welcome-email";
import type { PasswordChangedEventData } from "@/features/password/events/event-password-changed";
import type { PasswordResetEventData } from "@/features/password/events/event-password-reset";

// Define the event schemas for Inngest
type Events = {
  "password.reset": {
    data: PasswordResetEventData;
  };
  "email.verification": {
    data: EmailVerificationEventData;
  };
  "email.otp": {
    data: EmailOTPEventData;
  };
  "user.welcome": {
    data: WelcomeEmailEventData;
  };
  "password.changed": {
    data: PasswordChangedEventData;
  };
};

// Create a client to send and receive events with type-safe event schemas
export const inngest = new Inngest({
  id: "firstroad",
  schemas: new EventSchemas().fromRecord<Events>(),
});
