import { RedirectToast } from "@/components/redirect-toast";

const TicketLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <RedirectToast />
  </>
);

export default TicketLayout;
