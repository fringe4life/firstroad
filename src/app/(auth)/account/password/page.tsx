import type { Metadata } from "next";
import AccountTabs from "@/app/(auth)/account/_components/account-tabs";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import { changePassword } from "@/features/auth/actions/change-password-action";
import ChangePasswordForm from "@/features/auth/components/change-password-form";

export const metadata: Metadata = {
  title: "Password",
  description: "Change your First Road account password securely.",
};

const PasswordPage = () => (
  <div className="grid gap-y-8">
    <Heading
      description="Keep your account secure"
      tabs={<AccountTabs />}
      title="Password"
    />
    <CardCompact
      className="max-content-widest mx-auto"
      content={<ChangePasswordForm changePasswordAction={changePassword} />}
      description="Choose a strong, unique password"
      title="Update password"
    />
  </div>
);

export default PasswordPage;
