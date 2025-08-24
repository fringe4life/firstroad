import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import SignInForm from "@/features/auth/components/sign-in-form"; 

export const metadata: Metadata = {
	title: "Sign In | First Road",
	description: "Sign in to your First Road account to access tickets, manage your profile, and collaborate with the community.",
};

const SignInPage = () => {
  return (
    <div className="flex-1 flex flex-col justfy-center items-center">
      <CardCompact
        title="Sign in"
        description="Sign in to your account"
        className="w-full max-w-120 self-center animate-fade-from-top"
        content={<SignInForm />}
        footer={
          <div className="flex justify-between w-full">
            <Link className="text-sm text-muted-foreground" href="/sign-up">
              No account yet?
            </Link>
            <Link
              className="text-sm text-muted-foreground"
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
