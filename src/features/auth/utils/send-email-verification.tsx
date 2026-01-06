import { resend } from "@/lib/email";

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
    template: {
      id: "email-verification",
      variables: {
        TO_NAME: userName || email,
        URL: verificationUrl,
      },
    },
  });
