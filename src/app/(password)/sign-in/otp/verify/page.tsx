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

const SignInOTPVerifyForm = async ({
  searchParams,
}: SignInOTPVerifyPageProps) => {
  const { email } = await searchParams;
  return (
    <OTPVerifyForm
      email={email}
      submitLabel="Sign In"
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
          <SignInOTPVerifyForm searchParams={searchParams} />
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
