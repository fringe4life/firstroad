import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signin } from "@/features/password/actions/signin-action";
import SignInForm from "@/features/password/components/sign-in-form";
import { forgotPasswordPath, signUpPath } from "@/path";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your First Road account to access your tickets and manage your profile.",
};

// biome-ignore lint/suspicious/useAwait: for use with use cache
const SignInPage = async () => {
  "use cache";

  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={<SignInForm signinAction={signin} />}
        description="Sign in to your account"
        footer={
          <div className="flex w-full justify-between">
            <Link className="text-muted-foreground text-sm" href={signUpPath}>
              No account yet?
            </Link>
            <Link
              className="text-muted-foreground text-sm"
              href={forgotPasswordPath}
            >
              Forgot Password?
            </Link>
          </div>
        }
        title="Sign in"
      />
    </div>
  );
};

export default SignInPage;
