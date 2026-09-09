"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignInPageContent } from "@/features/password/components/sign-in-page-content";
import { signInPath } from "@/path";

const SignInModal = () => {
  const { back } = useRouter();
  const pathname = usePathname();

  if (pathname !== signInPath()) {
    return null;
  }

  const handleOpenChange: ComponentProps<typeof Dialog>["onOpenChange"] = (
    open,
  ) => {
    if (!open) {
      back();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={true}>
      <DialogContent size="wide" variant="ghost">
        <DialogTitle className="sr-only">Sign in to your account</DialogTitle>
        <SignInPageContent />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
