import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signin } from "@/features/password/actions/signin-action";
import { forgotPasswordPath, signInOTPSendPath, signUpPath } from "@/path";
import { GithubLoginButton } from "./github-login-button";
import { SignInForm } from "./sign-in-form";

const SignInPageContent = () => (
  <CardCompact
    content={<SignInForm signinAction={signin} />}
    description="Sign in to your account"
    footer={
      <div className="grid w-full items-center justify-center gap-4 sm:grid-cols-2 sm:justify-between">
        <Link
          className="text-center text-muted-foreground text-sm"
          href={signUpPath()}
        >
          No account yet?
        </Link>
        <Link
          className="text-center text-muted-foreground text-sm"
          href={forgotPasswordPath()}
        >
          Forgot Password?
        </Link>
        <Link
          className="text-center text-muted-foreground text-sm"
          href={signInOTPSendPath()}
        >
          Sign in with OTP
        </Link>
        <GithubLoginButton />
      </div>
    }
    title="Sign in"
  />
);

export { SignInPageContent };
