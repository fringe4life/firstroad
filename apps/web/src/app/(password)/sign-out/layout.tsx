import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Signing out of your First Road account.",
};

const SignOutLayout = ({ children }: { children: React.ReactNode }) => children;

export default SignOutLayout;
