import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignInPageContent } from "@/features/password/components/sign-in-page-content";

const SignInModal = () => (
  <Dialog defaultOpen>
    <DialogTitle className="sr-only">Sign in to your account</DialogTitle>
    <DialogContent className="sm:max-content-widest">
      <SignInPageContent />
    </DialogContent>
  </Dialog>
);

export default SignInModal;
