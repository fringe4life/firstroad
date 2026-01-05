import { RedirectToast } from "@/components/redirect-toast";

const TicketLayout = ({ children }: LayoutProps<"/">) => (
  <div className="grid h-full w-full grid-rows-[min-content_1fr] gap-y-8">
    {children}
    <RedirectToast />
  </div>
);

export default TicketLayout;
