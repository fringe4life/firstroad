"use client";

import { useEffect } from "react";
import { Suspend } from "@/components/suspend";
import { signOut } from "@/features/auth/actions/signout";

// Dynamic sign-out logic - calls server action to handle cookie deletion and redirect
const SignOutLogic = () => {
  useEffect(() => {
    // Call server action which handles cookie deletion and redirect
    signOut();
  }, []);

  return null;
};

// Loading fallback
const SignOutFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  </div>
);

const SignOutPage = () => (
  <Suspend fallback={<SignOutFallback />}>
    <SignOutLogic />
  </Suspend>
);

export default SignOutPage;
