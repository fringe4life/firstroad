import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import SignInForm from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | First Road",
  description:
    "Sign in to your First Road account to access tickets, manage your profile, and collaborate with the community.",
};

const SignInPage = () => {
  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        title="Sign in"
        description="Sign in to your account"
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={<SignInForm />}
        footer={
          <div className="flex w-full justify-between">
            <Link className="text-muted-foreground text-sm" href="/sign-up">
              No account yet?
            </Link>
            <Link
              className="text-muted-foreground text-sm"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default SignInPage;
