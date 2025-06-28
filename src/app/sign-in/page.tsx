import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import SignInForm from "@/features/auth/components/sign-in-form";
import { passwordForgotPath, signUpPath } from "@/path";

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
            <Link className="text-sm text-muted-foreground" href={signUpPath()}>
              No account yet?
            </Link>
            <Link
              className="text-sm text-muted-foreground"
              href={passwordForgotPath()}
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
