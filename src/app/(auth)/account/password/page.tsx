import type { Metadata } from "next";
import { changePassword } from "src/features/password/actions/change-password-action";
import ChangePasswordForm from "src/features/password/components/change-password-form";
import AccountTabs from "@/app/(auth)/account/_components/account-tabs";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";

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
