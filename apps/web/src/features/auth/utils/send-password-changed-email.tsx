import { resend } from "@/lib/email";

export const sendPasswordChangedEmail = async (
  email: string,
  userName?: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Password Changed - TicketBounty",
    template: {
      id: "password-changed-email",
      variables: {
        TO_NAME: userName ?? "User",
        // biome-ignore lint/style/noNonNullAssertion: exists
        APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
      },
    },
  });
