import { resend } from "@/lib/email";

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
  userName?: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Password Reset from TicketBounty",
    template: {
      id: "password-reset-email",
      variables: {
        TO_NAME: userName || email,
        URL: resetUrl,
      },
    },
  });
