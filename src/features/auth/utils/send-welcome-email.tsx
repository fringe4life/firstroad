import { resend } from "@/lib/email";
import WelcomeEmail from "../../../../emails/welcome-email";

export const sendWelcomeEmail = async (email: string, userName?: string) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Welcome to TicketBounty! 🎉",
    react: (
      <WelcomeEmail
        appUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        toName={userName || email}
      />
    ),
  });
