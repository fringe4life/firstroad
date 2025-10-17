import EmailVerification from "react-email-starter/emails/email-verification";
import { resend } from "@/lib/email";
import { env } from "@/lib/env";

export const sendEmailVerification = async (
  email: string,
  verificationUrl: string,
  userName?: string,
) =>
  await resend.emails.send({
    from: env.RESEND_FROM,
    to: email,
    subject: "Verify Your Email - TicketBounty",
    react: (
      <EmailVerification toName={userName || email} url={verificationUrl} />
    ),
  });
