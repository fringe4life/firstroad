import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ForgotPasswordPageContent } from "@/features/password/components/forgot-password-page-content";

const ForgotPasswordModal = () => (
  <Dialog defaultOpen>
    <DialogTitle className="sr-only">Forgot your password?</DialogTitle>
    <DialogContent className="sm:max-content-widest">
      <ForgotPasswordPageContent />
    </DialogContent>
  </Dialog>
);

export default ForgotPasswordModal;
