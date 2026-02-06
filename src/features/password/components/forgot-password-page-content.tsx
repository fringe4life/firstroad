import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { forgotPassword } from "@/features/password/actions/forgot-password-action";
import { signInPath } from "@/path";
import { ForgotPasswordForm } from "./forgot-password-form";

const ForgotPasswordPageContent = () => (
  <CardCompact
    content={<ForgotPasswordForm forgotPasswordAction={forgotPassword} />}
    description="Enter your email address and we'll send you a link to reset your password"
    footer={
      <Link className="text-muted-foreground text-sm" href={signInPath()}>
        Back to Sign In
      </Link>
    }
    title="Forgot Password"
  />
);
export { ForgotPasswordPageContent };
