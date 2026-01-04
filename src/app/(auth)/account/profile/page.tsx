import type { Metadata } from "next";
import { AccountTabs } from "@/app/(auth)/account/_components/account-tabs";
import { Heading } from "@/components/heading";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your First Road profile and account settings.",
};

const ProfilePage = () => (
  <Heading
    description="All your profile information"
    tabs={<AccountTabs />}
    title="Profile"
  />
);

export default ProfilePage;
