import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Verify Email | First Road",
  description:
    "Check your email to verify your First Road account. We've sent you a verification email to complete your registration.",
};

const VerifyEmailPage = () => {
  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        title="Check Your Email"
        description="We've sent you a verification email. Please check your inbox and click the verification link to complete your registration"
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={
          <div className="pt-4">
            <Link
              href={signInPath}
              className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to Sign In
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default VerifyEmailPage;
