import { resend } from "@/lib/email";

export const sendEmailVerification = async (
  email: string,
  verificationUrl: string,
  userName?: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    subject: "Verify Your Email - FirstTicket",
    template: {
      id: "email-verification",
      variables: {
        TO_NAME: userName ?? "User",
        URL: verificationUrl,
      },
    },
    to: email,
  });
