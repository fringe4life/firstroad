import { resend } from "@/lib/email";

export const sendWelcomeEmail = async (email: string, userName?: string) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Welcome to TicketBounty! 🎉",
    template: {
      id: "welcome-email",
      variables: {
        TO_NAME: userName || email,
        APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
    },
  });
