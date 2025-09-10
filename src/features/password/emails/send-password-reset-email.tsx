import { resend } from "@/lib/email";
import EmailPasswordReset from "../../../../react-email-starter/emails/password-reset-email";
import { env } from "@/lib/env";

export const sendEmailPasswordReset = async (
  username: string,
  email: string,
  passwordResetLink: string,
) => {
  return await resend.emails.send({
    // your own custom domain here
    // or your email that you used to sign up at Resend
    from: env.RESEND_FROM,
    to: email,
    subject: "Password Reset from TicketBounty",
    react: <EmailPasswordReset toName={username} url={passwordResetLink} />,
  });
};
