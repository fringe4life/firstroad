import { resend } from "@/lib/email";
import { env } from "@/lib/env";
import WelcomeEmail from "../../../../react-email-starter/emails/welcome-email";

export const sendWelcomeEmail = async (email: string, userName?: string) =>
  await resend.emails.send({
    from: env.RESEND_FROM,
    to: email,
    subject: "Welcome to TicketBounty! 🎉",
    react: (
      <WelcomeEmail
        appUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        toName={userName || email}
      />
    ),
  });
