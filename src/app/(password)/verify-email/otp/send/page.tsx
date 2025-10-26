import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { sendEmailVerificationOTP } from "@/features/auth/actions/send-otp-action";
import OTPSendForm from "@/features/auth/components/otp-send-form";
import { verifyEmailPath } from "@/path";

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
      <Link className="text-muted-foreground text-sm" href={verifyEmailPath}>
        Back to Email Verification
      </Link>
    }
    title="Verify Your Email"
  />
);

export default VerifyEmailOTPSendPage;
