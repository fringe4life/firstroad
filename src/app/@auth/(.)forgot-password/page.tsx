import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ForgotPasswordPageContent } from "@/features/password/components/forgot-password-page-content";

const ForgotPasswordModal = () => (
  <Dialog defaultOpen>
    <DialogContent className="sm:max-w-[480px]">
      <ForgotPasswordPageContent />
    </DialogContent>
  </Dialog>
);

export default ForgotPasswordModal;
