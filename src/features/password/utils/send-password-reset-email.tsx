import { resend } from "@/lib/email";
import { env } from "@/lib/env";
import EmailPasswordReset from "../../../../react-email-starter/emails/password-reset-email";

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
