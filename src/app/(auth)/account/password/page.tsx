import type { Metadata } from "next";
import AccountTabs from "@/app/(auth)/account/_components/account-tabs";
import Heading from "@/components/heading";

export const metadata: Metadata = {
  title: "Password | First Road",
  description:
    "Update your password to keep your account secure. Change your password regularly for better security.",
};

const PasswordPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Password"
        description="Keep your account secure"
        tabs={<AccountTabs />}
      />
    </div>
  );
};

export default PasswordPage;
