"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignInPageContent } from "@/features/password/components/sign-in-page-content";

const SignInModal = () => {
  const router = useRouter();
  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-content-widest">
        <DialogTitle className="sr-only">Sign in to your account</DialogTitle>
        <SignInPageContent />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
