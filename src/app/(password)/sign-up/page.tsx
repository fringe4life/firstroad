import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import SignUpForm from "@/features/password/components/sign-up-form";
import { signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new First Road account to start creating and managing tickets.",
};

const SignUpPage = () => {
  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        title="Sign Up"
        description="Create an accout to get started"
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={<SignUpForm />}
        footer={
          <Link className="text-muted-foreground text-sm" href={signInPath}>
            Have an account? sign in here
          </Link>
        }
      />
    </div>
  );
};

export default SignUpPage;
