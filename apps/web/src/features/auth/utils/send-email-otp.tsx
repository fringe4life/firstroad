import { resend } from "@/lib/email";

type OTPType = "sign-in" | "email-verification" | "forget-password";

export const sendEmailOTP = async (
  email: string,
  otp: string,
  type: OTPType,
  userName?: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    to: email,
    subject: getOTPSubject(type),
    template: {
      id: "email-otp-verification",
      variables: {
        TO_NAME: userName || email,
        OTP: otp,
        TYPE: getOTPSubject(type),
      },
    },
  });

const getOTPSubject = (type: OTPType): string => {
  switch (type) {
    case "sign-in":
      return "Your Sign-In Code - TicketBounty";
    case "email-verification":
      return "Verify Your Email - TicketBounty";
    case "forget-password":
      return "Reset Your Password - TicketBounty";
    default:
      return "Your Verification Code - TicketBounty";
  }
};
