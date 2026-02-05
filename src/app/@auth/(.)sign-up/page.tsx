import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignUpPageContent } from "@/features/password/components/sign-up-page-content";

const SignUpModal = () => (
  <Dialog defaultOpen>
    <DialogTitle className="sr-only">Create an account</DialogTitle>
    <DialogContent size="wide" variant="ghost">
      <SignUpPageContent />
    </DialogContent>
  </Dialog>
);

export default SignUpModal;
