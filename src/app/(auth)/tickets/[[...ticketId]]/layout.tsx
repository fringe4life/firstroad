import { RedirectToast } from "@/components/redirect-toast";

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <RedirectToast />
    </>
  );
}
