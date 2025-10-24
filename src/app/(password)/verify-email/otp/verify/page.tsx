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

const VerifyEmailOTPVerifyForm = async ({
  searchParams,
}: VerifyEmailOTPVerifyPageProps) => {
  const { email } = await searchParams;
  return (
    <OTPVerifyForm
      email={email}
      submitLabel="Verify Email"
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
          <VerifyEmailOTPVerifyForm searchParams={searchParams} />
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
