"use client";

import { useEffect } from "react";
import { Suspend } from "@/components/suspend";
import { signOut } from "@/features/auth/actions/signout";

const SignOutLogic = () => {
  useEffect(() => {
    signOut();
  }, []);

  return null;
};

const SignOutFallback = () => (
  <div className="flex min-h-dvh items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 aspect-square h-8 animate-spin rounded-full border-primary border-b-2" />
      <p className="text-muted-foreground">Signing out&hellip;</p>
    </div>
  </div>
);

const SignOutContent = () => (
  <Suspend fallback={<SignOutFallback />}>
    <SignOutLogic />
  </Suspend>
);

export { SignOutContent };
