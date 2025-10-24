import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import Spinner from "src/components/spinner";
import { CardCompact } from "@/components/card-compact";
import { verifySignInOTP } from "@/features/auth/actions/verify-otp-action";
import OTPVerifyForm from "@/features/auth/components/otp-verify-form";
import { signInPath } from "@/path";

type SignInOTPVerifyPageProps = {
  searchParams: Promise<{ email?: string }>;
};

type SuspendSignInOTPVerifyFormProps = {
  searchParamsPromise: Promise<{ email?: string }>;
};

const SuspendSignInOTPVerifyForm = async ({
  searchParamsPromise,
}: SuspendSignInOTPVerifyFormProps) => {
  const { email } = await searchParamsPromise;
  return (
    <OTPVerifyForm
      description="Enter the 6-digit sign-in code sent to your email"
      email={email}
      submitLabel="Sign In"
      title="Sign In with OTP"
      verifyOTPAction={verifySignInOTP}
    />
  );
};

// biome-ignore lint/suspicious/useAwait: needed for use cache
const SignInOTPVerifyPage = async ({
  searchParams,
}: SignInOTPVerifyPageProps) => {
  "use cache";
  cacheLife("max");
  return (
    <CardCompact
      content={
        <Suspense fallback={<Spinner />}>
          <SuspendSignInOTPVerifyForm searchParamsPromise={searchParams} />
        </Suspense>
      }
      description="Enter the sign-in code sent to your email"
      footer={
        <Link className="text-muted-foreground text-sm" href={signInPath}>
          Back to Sign In
        </Link>
      }
      title="Sign In with OTP"
    />
  );
};

export default SignInOTPVerifyPage;
