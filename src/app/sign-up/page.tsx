import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import SignUpForm from "@/features/auth/components/sign-up-form";
import { signInPath } from "@/path";

const SignUpPage = () => {
  return (
    <div className="flex-1 flex flex-col justfy-center items-center">
      <CardCompact
        title="Sign Up"
        description="Create an accout to get started"
        className="w-full max-w-120 self-center animate-fade-from-top"
        content={<SignUpForm />}
        footer={
          <Link className="text-sm text-muted-foreground" href={signInPath()}>
            Have an accout sign in here
          </Link>
        }
      />
    </div>
  );
};

export default SignUpPage;
