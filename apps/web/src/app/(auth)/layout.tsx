import { RedirectToast } from "@/components/redirect-toast";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <RedirectToast />
  </>
);

export default AuthLayout;
