import { RedirectToast } from "@/components/redirect-toast";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

export default async function TicketLayout({ children }: LayoutProps<"/">) {
  console.log("🎫 Tickets layout - Starting authentication check");
  console.log("📅 Layout timestamp:", new Date().toISOString());

  try {
    console.log("🔐 Calling getAuthOrRedirect...");
    await getAuthOrRedirect();
    console.log("✅ getAuthOrRedirect completed successfully");
  } catch (error) {
    console.log("❌ getAuthOrRedirect failed:", error);
    console.log("❌ Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    throw error;
  }

  console.log("🎫 Tickets layout - Rendering children");
  return (
    <>
      {children}
      <RedirectToast />
    </>
  );
}
