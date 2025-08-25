const VerifyEmailPage = () => {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Check Your Email</h1>
          <p className="text-muted-foreground">
            We've sent you a verification email. Please check your inbox and
            click the verification link to complete your registration.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="/sign-in"
            className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
