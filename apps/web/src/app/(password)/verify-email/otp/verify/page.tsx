import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { Suspend } from "@/components/suspend";
import { verifyEmailVerificationOTP } from "@/features/auth/actions/verify-otp-action";
import { OtpVerifyFormWithConnection } from "@/features/auth/components/otp-verify-form-with-connection";
import { OtpVerifyFormSkeleton } from "@/features/auth/components/skeletons/otp-verify-form-skeleton";
import type { EmailSearchParams } from "@/features/auth/types";
import { verifyEmailOTPSendPath } from "@/path";

const VerifyEmailOTPVerifyPage = ({ searchParams }: EmailSearchParams) => (
  <CardCompact
    content={
      <Suspend fallback={<OtpVerifyFormSkeleton />}>
        <OtpVerifyFormWithConnection
          redirectPathWhenNoEmail={verifyEmailOTPSendPath()}
          searchParams={searchParams}
          submitLabel="Verify Email"
          verifyOTPAction={verifyEmailVerificationOTP}
        />
      </Suspend>
    }
    description="Enter the verification code sent to your email"
    footer={
      <Link
        className="text-muted-foreground text-sm"
        href={verifyEmailOTPSendPath()}
      >
        Back to Send Email Verification
      </Link>
    }
    title="Verify Your Email"
  />
);

export default VerifyEmailOTPVerifyPage;
