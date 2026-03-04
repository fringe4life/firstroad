import type { Metadata } from "next";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { verifyEmailOTPSendPath } from "@/path";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Check your email for a verification link to activate your First Road account.",
};

const VerifyEmailPage = () => (
  <CardCompact
    content={
      <p className="text-muted-foreground text-sm">
        Click the link in the email to verify your account and continue.
      </p>
    }
    description="We&apos;ve sent a verification link to your email address."
    footer={
      <Link
        className="text-muted-foreground text-xs underline underline-offset-4"
        href={verifyEmailOTPSendPath()}
      >
        Prefer a code instead? Verify with a one-time code.
      </Link>
    }
    title="Check your email"
  />
);

export default VerifyEmailPage;
