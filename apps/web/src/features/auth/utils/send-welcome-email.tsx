import { resend } from "@/lib/email";

export const sendWelcomeEmail = async (email: string, userName?: string) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    subject: "Welcome to FirstTicket! 🎉",
    template: {
      id: "welcome-email",
      variables: {
        // biome-ignore lint/style/noNonNullAssertion: will exist
        APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
        TO_NAME: userName ?? "User",
      },
    },
    to: email,
  });
