import type { Metadata } from "next";
import { SignUpPageContent } from "@/features/password/components/sign-up-page-content";

export const metadata: Metadata = {
  description:
    "Create a new First Road account to start creating and managing tickets.",
  title: "Sign Up",
};

const SignUpPage = () => <SignUpPageContent />;

export default SignUpPage;
