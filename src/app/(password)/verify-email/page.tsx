import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to complete your account setup.",
};

const VerifyEmailPage = () => {
  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={
          <div className="pt-4">
            <Link
              className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              href={signInPath}
            >
              Back to Sign In
            </Link>
          </div>
        }
        description="We've sent you a verification email. Please check your inbox and click the verification link to complete your registration"
        title="Check Your Email"
      />
    </div>
  );
};

export default VerifyEmailPage;
