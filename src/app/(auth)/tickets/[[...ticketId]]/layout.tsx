import { RedirectToast } from "@/components/redirect-toast";

const TicketsLayout = ({
  children,
}: LayoutProps<"/tickets/[[...ticketId]]">) => (
  <>
    {children}
    <RedirectToast />
  </>
);

export default TicketsLayout;
