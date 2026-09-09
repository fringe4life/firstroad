import type { Metadata } from "next";
import { SignOutContent } from "./_components/sign-out-content";

export const metadata: Metadata = {
  description: "Signing out of your First Road account.",
  title: "Sign Out",
};

const SignOutPage = () => <SignOutContent />;

export default SignOutPage;
