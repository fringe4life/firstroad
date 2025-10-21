import { cacheLife } from "next/cache";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signin } from "@/features/password/actions/signin-action";
import { forgotPasswordPath, signUpPath } from "@/path";
import SignInForm from "./sign-in-form";

// biome-ignore lint/suspicious/useAwait: for use with use cache
export async function SignInPageContent() {
  "use cache";
  cacheLife("max");
  return (
    <CardCompact
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
  );
}
