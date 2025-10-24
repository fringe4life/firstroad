import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignInPageContent } from "@/features/password/components/sign-in-page-content";

const SignInModal = () => (
  <Dialog defaultOpen>
    <DialogContent className="sm:max-content-widest">
      <SignInPageContent />
    </DialogContent>
  </Dialog>
);

export default SignInModal;
