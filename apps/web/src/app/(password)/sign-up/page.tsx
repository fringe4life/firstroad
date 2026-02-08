import type { Metadata } from "next";
import { SignUpPageContent } from "@/features/password/components/sign-up-page-content";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new First Road account to start creating and managing tickets.",
};

const SignUpPage = () => <SignUpPageContent />;

export default SignUpPage;
