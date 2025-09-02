import { RedirectToast } from "@/components/redirect-toast";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";

export default async function TicketLayout({ children }: LayoutProps<"/">) {
  await getSessionOrRedirect();
  return (
    <>
      {children}
      <RedirectToast />
    </>
  );
}
