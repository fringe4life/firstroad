import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { sendEmailVerificationOTP } from "@/features/auth/actions/send-otp-action";
import { OTPSendForm } from "@/features/auth/components/otp-send-form";
import { verifyEmailOTPSendPath } from "@/path";

export const metadata: Metadata = {
  description:
    "Enter your email address to receive a verification code for your First Road account.",
  title: "Verify Your Email",
};

const VerifyEmailOTPSendPage = () => (
  <CardCompact
    content={
      <OTPSendForm
        description="Enter your email address to receive a verification code"
        sendOTPAction={sendEmailVerificationOTP}
        submitLabel="Send Verification Code"
        title="Verify Your Email"
      />
    }
    description="Enter your email address to receive a verification code"
    footer={
      <Link
        className="text-muted-foreground text-sm"
        href={verifyEmailOTPSendPath()}
      >
        Back to Email Verification
      </Link>
    }
    title="Verify Your Email"
  />
);

export default VerifyEmailOTPSendPage;
