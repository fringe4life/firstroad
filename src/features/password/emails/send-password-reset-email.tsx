import { render } from "@react-email/components";
import { sendEmail } from "@/utils/send-email";
import EmailPasswordReset from "../../../../react-email-starter/emails/password-reset-email";

export const sendPasswordResetEmail = async (
  userName: string,
  email: string,
  passwordResetToken: string,
) => {
  const html = await render(
    <EmailPasswordReset toName={userName} url={email} />,
  );

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html,
  });
};
