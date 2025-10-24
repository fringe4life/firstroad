import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import Spinner from "src/components/spinner";
import { CardCompact } from "@/components/card-compact";
import { verifyEmailVerificationOTP } from "@/features/auth/actions/verify-otp-action";
import OTPVerifyForm from "@/features/auth/components/otp-verify-form";
import { verifyEmailPath } from "@/path";

type VerifyEmailOTPVerifyPageProps = {
  searchParams: Promise<{ email?: string }>;
};

type SuspendOTPVerifyFormProps = {
  searchParamsPromise: Promise<{ email?: string }>;
};

const SuspendOTPVerifyForm = async ({
  searchParamsPromise,
}: SuspendOTPVerifyFormProps) => {
  const { email } = await searchParamsPromise;
  return (
    <OTPVerifyForm
      description="Enter the 6-digit verification code sent to your email"
      email={email}
      submitLabel="Verify Email"
      title="Verify Your Email"
      verifyOTPAction={verifyEmailVerificationOTP}
    />
  );
};

// biome-ignore lint/suspicious/useAwait: needed for use cache
const VerifyEmailOTPVerifyPage = async ({
  searchParams,
}: VerifyEmailOTPVerifyPageProps) => {
  "use cache";
  cacheLife("max");
  return (
    <CardCompact
      content={
        <Suspense fallback={<Spinner />}>
          <SuspendOTPVerifyForm searchParamsPromise={searchParams} />
        </Suspense>
      }
      description="Enter the verification code sent to your email"
      footer={
        <Link className="text-muted-foreground text-sm" href={verifyEmailPath}>
          Back to Email Verification
        </Link>
      }
      title="Verify Your Email"
    />
  );
};

export default VerifyEmailOTPVerifyPage;
