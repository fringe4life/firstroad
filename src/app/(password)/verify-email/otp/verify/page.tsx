import Link from "next/link";
import { connection } from "next/server";
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
  await connection();
  const { email } = await searchParams;
  return (
    <OTPVerifyForm
      email={email}
      submitLabel="Verify Email"
      verifyOTPAction={verifyEmailVerificationOTP}
    />
  );
};

const VerifyEmailOTPVerifyPage = ({
  searchParams,
}: VerifyEmailOTPVerifyPageProps) => (
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

export default VerifyEmailOTPVerifyPage;
