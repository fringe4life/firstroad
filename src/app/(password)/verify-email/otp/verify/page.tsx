import Link from "next/link";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Spinner } from "@/components/spinner";
import { Suspend } from "@/components/suspend";
import { verifyEmailVerificationOTP } from "@/features/auth/actions/verify-otp-action";
import { OTPVerifyForm } from "@/features/auth/components/otp-verify-form";
import { verifyEmailOTPSendPath } from "@/path";

interface VerifyEmailOTPVerifyPageProps {
  searchParams: Promise<{ email?: string }>;
}

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
      <Suspend fallback={<Spinner />}>
        <VerifyEmailOTPVerifyForm searchParams={searchParams} />
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
