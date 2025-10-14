import { RedirectToast } from "@/components/redirect-toast";

const TicketLayout = ({ children }: LayoutProps<"/">) => (
  <>
    {children}
    <RedirectToast />
  </>
);

export default TicketLayout;
