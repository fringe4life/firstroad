import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CardCompact } from "@/components/card-compact";
import ResetPasswordForm from "@/features/password/components/reset-password-form";
import { forgotPasswordPath, signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Set a new password for your First Road account. Enter your new password below.",
};

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const { token } = await params;

  if (!token) {
    redirect(forgotPasswordPath);
  }

  return (
    <div className="justfy-center flex flex-1 flex-col items-center">
      <CardCompact
        className="w-full max-w-120 animate-fade-from-top self-center"
        content={<ResetPasswordForm token={token} />}
        description="Enter your new password below"
        footer={
          <Link className="text-muted-foreground text-sm" href={signInPath}>
            Back to Sign In
          </Link>
        }
        title="Reset Password"
      />
    </div>
  );
};

export default ResetPasswordPage;
