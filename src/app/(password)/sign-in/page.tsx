import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import SignInForm from "@/features/password/components/sign-in-form";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { forgotPasswordPath, signUpPath, ticketsPath } from "@/path";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your First Road account to access your tickets and manage your profile.",
};

const SignInPage = async () => {
  await getSessionOrRedirect({
    when: "has-session",
    redirectPath: ticketsPath,
  });

  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        title="Sign in"
        description="Sign in to your account"
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={<SignInForm />}
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
      />
    </div>
  );
};

export default SignInPage;
