import type { Metadata } from "next";
import { ForgotPasswordPageContent } from "@/features/password/components/forgot-password-page-content";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your First Road account password. Enter your email address and we'll send you a reset link.",
};

const ForgotPasswordPage = () => <ForgotPasswordPageContent />;

export default ForgotPasswordPage;
