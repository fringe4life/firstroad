import type { Metadata } from "next";
import AccountTabs from "@/app/(auth)/account/_components/account-tabs";
import Heading from "@/components/heading";

export const metadata: Metadata = {
	title: "Profile",
	description: "Manage your First Road profile and account settings.",
};

const ProfilePage = () => {
	return (
		<div className="flex flex-1 flex-col gap-y-8">
			<Heading
				title="Profile"
				description="All your profile information"
				tabs={<AccountTabs />}
			/>
		</div>
	);
};

export default ProfilePage;
