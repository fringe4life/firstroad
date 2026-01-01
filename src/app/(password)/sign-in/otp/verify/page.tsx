import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Spinner } from "@/components/spinner";
import { verifySignInOTP } from "@/features/auth/actions/verify-otp-action";
import OTPVerifyForm from "@/features/auth/components/otp-verify-form";
import { signInPath } from "@/path";

interface SignInOTPVerifyPageProps {
  searchParams: Promise<{ email?: string }>;
}

const SignInOTPVerifyForm = async ({
  searchParams,
}: SignInOTPVerifyPageProps) => {
  await connection();
  const { email } = await searchParams;
  return (
    <OTPVerifyForm
      email={email}
      submitLabel="Sign In"
      verifyOTPAction={verifySignInOTP}
    />
  );
};
const SignInOTPVerifyPage = ({ searchParams }: SignInOTPVerifyPageProps) => (
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

export default SignInOTPVerifyPage;
