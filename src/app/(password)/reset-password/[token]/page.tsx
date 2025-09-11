import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CardCompact } from "@/components/card-compact";
import ResetPasswordForm from "@/features/password/components/reset-password-form";
import { forgotPasswordPath, signInPath } from "@/path";

export const metadata: Metadata = {
	title: "Reset Password",
	description:
		"Set a new password for your First Road account. Enter your new password below.",
};

interface ResetPasswordPageProps {
	params: Promise<{ token: string }>;
}

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
	const { token } = await params;

	if (!token) {
		redirect(forgotPasswordPath);
	}

	return (
		<div className="justfy-center flex flex-1 flex-col items-center">
			<CardCompact
				title="Reset Password"
				description="Enter your new password below"
				className="w-full max-w-120 animate-fade-from-top self-center"
				content={<ResetPasswordForm token={token} />}
				footer={
					<Link className="text-muted-foreground text-sm" href={signInPath}>
						Back to Sign In
					</Link>
				}
			/>
		</div>
	);
};

export default ResetPasswordPage;
