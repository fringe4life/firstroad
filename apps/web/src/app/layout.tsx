import "./globals.css";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeTransition } from "@/components/theme/theme-transition";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { MobileSidebarProvider } from "@/features/navigation/context/context";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  authors: [{ name: "First Road Team" }],
  creator: "First Road",
  keywords: [
    "tickets",
    "collaboration",
    "development",
    "projects",
    "community",
  ],
  openGraph: {
    locale: "en_US",
    siteName: "First Road",
    type: "website",
    url: "https://first-ticket.fyi",
  },
  title: {
    default: "First Road",
    template: "%s | First Road",
  },
};

const RootLayout = ({ children, auth }: LayoutProps<"/">) => (
  <html
    className={cn(
      "scrollbar-thin scrollbar-gutter-stable md:[--side-width:4.0625rem]",
      "font-sans",
      geist.variable,
    )}
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
              <div className="layout-grid-cols grid grid-flow-col has-[.sidebar:focus-within]:[--side-width:var(--expanded-sidebar-width)] has-[.sidebar:hover]:[--side-width:var(--expanded-sidebar-width)]">
                <Sidebar />
                <main className="col-span-2 min-h-dvh overflow-x-clip px-4 py-24 sm:px-8 md:col-start-2">
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
