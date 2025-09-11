import type { Metadata } from "next";
import AccountTabs from "@/app/(auth)/account/_components/account-tabs";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import ChangePasswordForm from "@/features/auth/components/change-password-form";

export const metadata: Metadata = {
	title: "Password",
	description: "Change your First Road account password securely.",
};

const PasswordPage = () => {
	return (
		<div className="flex flex-1 flex-col gap-y-8">
			<Heading
				title="Password"
				description="Keep your account secure"
				tabs={<AccountTabs />}
			/>
			<CardCompact
				title="Update password"
				description="Choose a strong, unique password"
				content={<ChangePasswordForm />}
				className="mx-auto w-full max-w-120"
			/>
		</div>
	);
};

export default PasswordPage;
