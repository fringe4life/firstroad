import { AccountTabs } from "@/app/(auth)/account/_components/account-tabs";
import { Heading } from "@/components/heading";

const AccountProfileHeader = () => (
  <Heading
    description="All your profile information"
    tabs={<AccountTabs />}
    title="Profile"
  />
);

export default AccountProfileHeader;
