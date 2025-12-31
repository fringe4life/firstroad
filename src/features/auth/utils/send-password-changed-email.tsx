import { resend } from "@/lib/email";
import PasswordChangedEmail from "../../../../emails/password-changed-email";

export const sendPasswordChangedEmail = async (
  email: string,
  userName?: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Password Changed - TicketBounty",
    react: (
      <PasswordChangedEmail
        appUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        toName={userName || email}
      />
    ),
  });
