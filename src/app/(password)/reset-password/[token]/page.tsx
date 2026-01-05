import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Spinner } from "@/components/spinner";
import { ResetPasswordForm } from "@/features/password/components/reset-password-form";
import { signInPath } from "@/path";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Set a new password for your First Road account. Enter your new password below.",
};

interface ResetPasswordFormProps {
  tokenPromise: PageProps<"/reset-password/[token]">["params"];
}

const SuspendResetPasswordForm = async ({
  tokenPromise,
}: ResetPasswordFormProps) => {
  await connection();
  const { token } = await tokenPromise;
  return <ResetPasswordForm token={token} />;
};

const ResetPasswordPage = ({
  params,
}: PageProps<"/reset-password/[token]">) => (
  <CardCompact
    content={
      <Suspense fallback={<Spinner />}>
        <SuspendResetPasswordForm tokenPromise={params} />
      </Suspense>
    }
    description="Enter your new password below"
    footer={
      <Link className="text-muted-foreground text-sm" href={signInPath()}>
        Back to Sign In
      </Link>
    }
    title="Reset Password"
  />
);

export default ResetPasswordPage;
