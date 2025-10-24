import { cacheLife } from "next/cache";
import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { sendSignInOTP } from "@/features/auth/actions/send-otp-action";
import OTPSendForm from "@/features/auth/components/otp-send-form";
import { signInPath } from "@/path";

// biome-ignore lint/suspicious/useAwait: needed for use cache
const SignInOTPSendPage = async () => {
  "use cache";
  cacheLife("max");

  return (
    <CardCompact
      content={
        <OTPSendForm
          description="Enter your email address to receive a sign-in code"
          sendOTPAction={sendSignInOTP}
          submitLabel="Send Sign-In Code"
          title="Sign In with OTP"
        />
      }
      description="Enter your email address to receive a sign-in code"
      footer={
        <Link className="text-muted-foreground text-sm" href={signInPath}>
          Back to Sign In
        </Link>
      }
      title="Sign In with OTP"
    />
  );
};

export default SignInOTPSendPage;
