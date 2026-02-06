"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignUpPageContent } from "@/features/password/components/sign-up-page-content";
import { signUpPath } from "@/path";

const SignUpModal = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== signUpPath()) {
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
      <DialogTitle className="sr-only">Create an account</DialogTitle>
      <DialogContent size="wide" variant="ghost">
        <SignUpPageContent />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
