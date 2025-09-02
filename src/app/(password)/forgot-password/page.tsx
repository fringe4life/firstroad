import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your First Road account password. Enter your email address and we'll send you a reset link.",
};

const ForgotPasswordPage = () => {
  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        title="Forgot Password"
        description="Enter your email address and we'll send you a link to reset your password"
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={<ForgotPasswordForm />}
        footer={
          <Link className="text-muted-foreground text-sm" href={signInPath}>
            Back to Sign In
          </Link>
        }
      />
    </div>
  );
};

export default ForgotPasswordPage;
