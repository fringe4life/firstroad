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
    subject: getOTPSubject(type),
    template: {
      id: "email-otp-verification",
      variables: {
        OTP: otp,
        TO_NAME: userName ?? "User",
        TYPE: getOTPSubject(type),
      },
    },
    to: email,
  });

const getOTPSubject = (type: OTPType): string => {
  switch (type) {
    case "sign-in":
      return "Your Sign-In Code - FirstTicket";
    case "email-verification":
      return "Verify Your Email - FirstTicket";
    case "forget-password":
      return "Reset Your Password - FirstTicket";
    default:
      return "Your Verification Code - FirstTicket";
  }
};
