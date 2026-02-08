import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeTransition } from "@/components/theme/theme-transition";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { MobileSidebarProvider } from "@/features/navigation/context/context";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "First Road",
    template: "%s | First Road",
  },
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
    url: "https://first-ticket.fyi",
    siteName: "First Road",
  },
};

const RootLayout = ({ children, auth }: LayoutProps<"/">) => (
  <html
    className="md:[--side-width:4.0625rem]"
    data-scroll-behavior="smooth"
    lang="en"
    suppressHydrationWarning
  >
    <body className={`${inter.className} antialiased`}>
      <ThemeProvider>
        <ThemeTransition>
          <NuqsAdapter>
            <MobileSidebarProvider>
              <Header />
              <div className="layout-grid-cols grid grid-flow-col has-[.sidebar:hover]:[--side-width:var(--expanded-sidebar-width)]">
                <Sidebar />
                <main className="col-span-2 min-h-screen overflow-x-clip px-4 py-24 sm:px-8 md:col-start-2">
                  {children}
                </main>
              </div>
              {auth}
              <Toaster expand />
            </MobileSidebarProvider>
          </NuqsAdapter>
        </ThemeTransition>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
