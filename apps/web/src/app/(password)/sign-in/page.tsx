import type { Metadata } from "next";
import { SignInPageContent } from "@/features/password/components/sign-in-page-content";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your First Road account to access your tickets and manage your profile.",
};

const SignInPage = () => <SignInPageContent />;

export default SignInPage;
