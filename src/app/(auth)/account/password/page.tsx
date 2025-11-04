import type { Metadata } from "next";
import { CardCompact } from "@/components/card-compact";
import { changePassword } from "@/features/password/actions/change-password-action";
import ChangePasswordForm from "@/features/password/components/change-password-form";

export const metadata: Metadata = {
  title: "Password",
  description: "Change your First Road account password securely.",
};

const PasswordPage = () => (
  <CardCompact
    className="max-content-widest mx-auto"
    content={<ChangePasswordForm changePasswordAction={changePassword} />}
    description="Choose a strong, unique password"
    title="Update password"
  />
);

export default PasswordPage;
