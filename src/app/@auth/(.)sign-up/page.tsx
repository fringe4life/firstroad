import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignUpPageContent } from "@/features/password/components/sign-up-page-content";

const SignUpModal = () => (
  <Dialog defaultOpen>
    <DialogContent className="sm:max-content-widest">
      <SignUpPageContent />
    </DialogContent>
  </Dialog>
);

export default SignUpModal;
