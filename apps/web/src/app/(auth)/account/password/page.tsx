import type { Metadata } from "next";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { changePassword } from "@/features/password/actions/change-password-action";
import { ChangePasswordForm } from "@/features/password/components/change-password-form";
import { AccountTabs } from "../_components/account-tabs";

export const metadata: Metadata = {
  title: "Password",
  description: "Change your First Road account password securely.",
};

const PasswordPage = async () => {
  await connection();
  await getUserOrRedirect();
  return (
    <>
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
    </>
  );
};

export default PasswordPage;
