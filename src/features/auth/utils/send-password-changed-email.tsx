import { resend } from "@/lib/email";
import { env } from "@/lib/env";
import PasswordChangedEmail from "../../../../react-email-starter/emails/password-changed-email";

export const sendPasswordChangedEmail = async (
  email: string,
  userName?: string,
) =>
  await resend.emails.send({
    from: env.RESEND_FROM,
    to: email,
    subject: "Password Changed - TicketBounty",
    react: (
      <PasswordChangedEmail
        appUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        toName={userName || email}
      />
    ),
  });
