import type { Metadata } from "next";
import AccountTabs from "@/app/(auth)/account/_components/account-tabs";
import Heading from "@/components/heading";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your First Road profile and account settings.",
};

// biome-ignore lint/suspicious/useAwait: for use with use cache
const ProfilePage = async () => {
  "use cache";
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        description="All your profile information"
        tabs={<AccountTabs />}
        title="Profile"
      />
    </div>
  );
};

export default ProfilePage;
