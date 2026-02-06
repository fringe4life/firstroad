import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signup } from "@/features/password/actions/signup-action";
import { signInPath } from "@/path";
import { SignUpForm } from "./sign-up-form";

const SignUpPageContent = () => (
  <CardCompact
    content={<SignUpForm signupAction={signup} />}
    description="Create an accout to get started"
    footer={
      <Link className="text-muted-foreground text-sm" href={signInPath()}>
        Have an account? sign in here
      </Link>
    }
    title="Sign Up"
  />
);
export { SignUpPageContent };
