import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signup } from "@/features/password/actions/signup-action";
import SignUpForm from "@/features/password/components/sign-up-form";
import { signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new First Road account to start creating and managing tickets.",
};

// biome-ignore lint/suspicious/useAwait: for use with use cache
const SignUpPage = async () => {
  "use cache";
  cacheLife("max");
  return (
    <CardCompact
      content={<SignUpForm signupAction={signup} />}
      description="Create an accout to get started"
      footer={
        <Link className="text-muted-foreground text-sm" href={signInPath}>
          Have an account? sign in here
        </Link>
      }
      title="Sign Up"
    />
  );
};

export default SignUpPage;
