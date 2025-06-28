import { Metadata } from "next";
import { RedirectToast } from "@/components/redirect-toast";

export const metadata: Metadata = {
  title: "First Road",
  description: "A guided Nextjs Journey",
};

export default function TicketLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {" "}
      {children}
      <RedirectToast />
    </>
  );
}
