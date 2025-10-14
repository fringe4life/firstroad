import EmailPasswordReset from "react-email-starter/emails/password-reset-email";
import { resend } from "@/lib/email";
import { env } from "@/lib/env";

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
  userName?: string,
) =>
  await resend.emails.send({
    from: env.RESEND_FROM,
    to: email,
    subject: "Password Reset from TicketBounty",
    react: <EmailPasswordReset toName={userName || email} url={resetUrl} />,
  });
