import { redirect } from "next/navigation";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
  const { token } = searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-bold text-2xl">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <ResetPasswordForm token={token} />

        <div className="text-center">
          <a
            href="/sign-in"
            className="text-muted-foreground text-sm underline hover:text-foreground"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
