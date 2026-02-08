import type { Route } from "next";
import { connection } from "next/dist/server/request/connection";
import { redirect } from "next/navigation";
import { verifyEmailVerificationOTP } from "../actions/verify-otp-action";
import type { EmailSearchParams } from "../types";
import { OTPVerifyForm, type OTPVerifyFormProps } from "./otp-verify-form";

interface OtpVerifyFormWithConnectionProps
  extends Omit<OTPVerifyFormProps, "email">,
    EmailSearchParams {
  redirectPathWhenNoEmail: Route;
}

const OtpVerifyFormWithConnection = async ({
  searchParams,
  submitLabel,
  redirectPathWhenNoEmail,
}: OtpVerifyFormWithConnectionProps) => {
  await connection();
  const { email } = await searchParams;
  if (!email) {
    redirect(redirectPathWhenNoEmail);
  }
  return (
    <OTPVerifyForm
      email={email}
      submitLabel={submitLabel}
      verifyOTPAction={verifyEmailVerificationOTP}
    />
  );
};

export { OtpVerifyFormWithConnection };
