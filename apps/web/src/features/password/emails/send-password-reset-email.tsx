import { resend } from "@/lib/email";

export const sendEmailPasswordReset = async (
  username: string,
  email: string,
  passwordResetLink: string,
) => {
  return await resend.emails.send({
    // your own custom domain here
    // or your email that you used to sign up at Resend
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: "Password Reset from TicketBounty",
    template: {
      id: "password-reset-email",
      variables: {
        TO_NAME: username,
        URL: passwordResetLink,
      },
    },
  });
};
