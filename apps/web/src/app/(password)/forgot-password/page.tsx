import type { Metadata } from "next";
import { ForgotPasswordPageContent } from "@/features/password/components/forgot-password-page-content";

export const metadata: Metadata = {
  description:
    "Reset your First Road account password. Enter your email address and we'll send you a reset link.",
  title: "Forgot Password",
};

const ForgotPasswordPage = () => <ForgotPasswordPageContent />;

export default ForgotPasswordPage;
