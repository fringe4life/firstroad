import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignUpPageContent } from "@/features/password/components/sign-up-page-content";

const SignUpModal = () => (
  <Dialog defaultOpen>
    <DialogContent className="sm:max-w-[480px]">
      <SignUpPageContent />
    </DialogContent>
  </Dialog>
);

export default SignUpModal;
