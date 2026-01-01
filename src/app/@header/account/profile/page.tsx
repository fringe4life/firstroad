import { AccountTabs } from "@/app/(auth)/account/_components/account-tabs";
import { Heading } from "@/components/heading";

const ProfilePageHeader = () => (
  <Heading
    description="All your profile information"
    tabs={<AccountTabs />}
    title="Profile"
  />
);

export default ProfilePageHeader;
