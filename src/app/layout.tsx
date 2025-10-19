import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Header from "@/app/_navigation/header";
import Sidebar from "@/app/_navigation/sidebar/components/sidebar";
import { MobileSidebarProvider } from "@/app/_navigation/sidebar/context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SidebarSkeleton } from "./_navigation/sidebar/components/sidebar-skeleton";

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

export default function RootLayout({ children, tickets }: LayoutProps<"/">) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider>
            <MobileSidebarProvider>
              <Header />
              <div className="grid h-screen border-collapse grid-flow-col grid-cols-[var(--side-width)_1fr] grid-rows-1 overflow-hidden">
                <Suspense fallback={<SidebarSkeleton />}>
                  <Sidebar />
                </Suspense>
                <main className="grid min-h-screen grid-rows-[min-content_min-content_1fr] gap-y-4 overflow-y-auto overflow-x-hidden px-8 py-24 transition-transform duration-200 peer-hover/sidebar:translate-x-[calc(15rem-var(--side-width))]">
                  {children}
                  {tickets}
                </main>
              </div>
              <Toaster expand />
            </MobileSidebarProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
