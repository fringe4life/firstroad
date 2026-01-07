import type { Metadata } from "next";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { changePassword } from "@/features/password/actions/change-password-action";
import { ChangePasswordForm } from "@/features/password/components/change-password-form";
import { AccountTabs } from "../_components/account-tabs";

export const metadata: Metadata = {
  title: "Password",
  description: "Change your First Road account password securely.",
};

const PasswordPage = () => (
  <div className="grid h-full w-full grid-rows-[min-content_min-content_1fr] justify-center gap-y-8">
    <Heading
      description="All your password information"
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
