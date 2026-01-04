import { RedirectToast } from "@/components/redirect-toast";

const TicketLayout = ({ children }: LayoutProps<"/">) => (
  <div className="grid justify-center gap-y-8">
    {children}
    <RedirectToast />
  </div>
);

export default TicketLayout;
