import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-bold text-2xl">Forgot Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <ForgotPasswordForm />

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

export default ForgotPasswordPage;
