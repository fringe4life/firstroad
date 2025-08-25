const ResetPasswordSuccessPage = () => {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Password Reset Successful</h1>
          <p className="text-muted-foreground">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="/sign-in"
            className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessPage;
