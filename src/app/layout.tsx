import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import Header from "@/app/_navigation/header";
import Sidebar from "@/app/_navigation/sidebar/components/sidebar";
import { MobileSidebarProvider } from "@/app/_navigation/sidebar/context";
import { ReactQueryProvider } from "@/app/_providers/react-query-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "First Road",
    template: "%s | First Road",
  },
  description:
    "A collaborative platform for creating and managing tickets. Connect with developers, share knowledge, and build amazing projects together.",
  keywords: [
    "tickets",
    "collaboration",
    "development",
    "projects",
    "community",
  ],
  authors: [{ name: "First Road Team" }],
  creator: "First Road",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://firstroad.com",
    title: "First Road",
    description:
      "A collaborative platform for creating and managing tickets. Connect with developers, share knowledge, and build amazing projects together.",
    siteName: "First Road",
  },
};

export const experimental_ppr = true;

export default function RootLayout({ children, tickets }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQueryProvider>
              <MobileSidebarProvider>
                <Header />
                <div className="flex h-screen border-collapse overflow-hidden">
                  <Sidebar />
                  <main className="flex min-h-screen flex-1 flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-8 py-24">
                    {children}
                    {tickets}
                  </main>
                </div>
              </MobileSidebarProvider>
              <Toaster expand />
            </ReactQueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
