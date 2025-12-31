import { resend } from "@/lib/email";
import EmailVerification from "../../../../emails/email-verification";

export const sendEmailVerification = async (
  email: string,
  verificationUrl: string,
  userName?: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Verify Your Email - TicketBounty",
    react: (
      <EmailVerification toName={userName || email} url={verificationUrl} />
    ),
  });
