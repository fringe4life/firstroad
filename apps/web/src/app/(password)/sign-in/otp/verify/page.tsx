import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { Suspend } from "@/components/suspend";
import { verifySignInOTP } from "@/features/auth/actions/verify-otp-action";
import { OtpVerifyFormSkeleton } from "@/features/auth/components/otp-verify-form-skeleton";
import { OtpVerifyFormWithConnection } from "@/features/auth/components/otp-verify-form-with-connection";
import type { EmailSearchParams } from "@/features/auth/types";
import { signInPath } from "@/path";

const SignInOTPVerifyPage = ({ searchParams }: EmailSearchParams) => (
  <CardCompact
    content={
      <Suspend fallback={<OtpVerifyFormSkeleton />}>
        <OtpVerifyFormWithConnection
          redirectPathWhenNoEmail={signInPath()}
          searchParams={searchParams}
          submitLabel="Sign In"
          verifyOTPAction={verifySignInOTP}
        />
      </Suspend>
    }
    description="Enter the sign-in code sent to your email"
    footer={
      <Link className="text-muted-foreground text-sm" href={signInPath()}>
        Back to Sign In
      </Link>
    }
    title="Sign In with OTP"
  />
);

export default SignInOTPVerifyPage;
