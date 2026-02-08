"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ForgotPasswordPageContent } from "@/features/password/components/forgot-password-page-content";
import { forgotPasswordPath } from "@/path";

const ForgotPasswordModal = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== forgotPasswordPath()) {
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
      <DialogTitle className="sr-only">Forgot your password?</DialogTitle>
      <DialogContent size="wide" variant="ghost">
        <ForgotPasswordPageContent />
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
