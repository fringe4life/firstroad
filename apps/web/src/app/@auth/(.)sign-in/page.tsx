"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignInPageContent } from "@/features/password/components/sign-in-page-content";
import { signInPath } from "@/path";

const SignInModal = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== signInPath()) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
      open={true}
    >
      <DialogContent size="wide" variant="ghost">
        <DialogTitle className="sr-only">Sign in to your account</DialogTitle>
        <SignInPageContent />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
