import "./globals.css";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Sidebar from "@/features/navigation/components/sidebar";
import { MobileSidebarProvider } from "@/features/navigation/context/context";
import type { Scope } from "@/features/ticket/search-params";

const inter = Inter({
  subsets: ["latin"],
});

// Cached metadata function to avoid endless server requests
const getCachedMetadata = async (scope: Scope): Promise<Metadata> => {
  "use cache";
  cacheTag("metadata");
  cacheLife("max");

  const baseMetadata = {
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

  const scopeSpecificMetadata = {
    all: {
      title: "All Tickets",
      description:
        "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
      openGraph: {
        title: "All Tickets | First Road",
        description:
          "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
      },
    },
    mine: {
      title: "My Tickets",
      description:
        "View and manage your personal tickets. Track your progress, update status, and collaborate with others.",
      openGraph: {
        title: "My Tickets | First Road",
        description:
          "View and manage your personal tickets. Track your progress, update status, and collaborate with others.",
      },
    },
  };

  const scopeMetadata =
    scopeSpecificMetadata[scope as keyof typeof scopeSpecificMetadata] ||
    scopeSpecificMetadata.all;

  return {
    ...baseMetadata,
    ...scopeMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      ...scopeMetadata.openGraph,
    },
  };
};

// Dynamic metadata generation based on search parameters
export const generateMetadata = async ({
  searchParams,
}: {
  searchParams?: Promise<{ scope?: Scope }>;
}): Promise<Metadata> => {
  // Handle cases where searchParams is undefined (non-home routes)
  if (!searchParams) {
    return await getCachedMetadata("all");
  }

  const { scope = "all" } = await searchParams;
  return await getCachedMetadata(scope);
};

const RootLayout = ({
  children,
  auth,
  tickets,
  ticketForm,
  header,
  comments,
  breadcrumbs,
}: LayoutProps<"/">) => (
  <html
    className="has-[.sidebar:focus-within]:[--expanded-sidebar-width:15rem] has-[.sidebar:hover]:[--expanded-sidebar-width:15rem] md:[--side-width:4.875rem]"
    data-scroll-behavior="smooth"
    lang="en"
    suppressHydrationWarning
  >
    <body className={`${inter.className} antialiased`}>
      <NuqsAdapter>
        <ThemeProvider>
          <MobileSidebarProvider>
            <Header />
            <div className="group/sidebar-parent layout-grid-cols grid grid-flow-col">
              <Sidebar />
              <main className="main-grid-rows main-inline-padding col-span-2 grid min-h-screen gap-y-8 overflow-x-clip py-24 transition-transform duration-200 group-has-[.sidebar:hover]/sidebar-parent:translate-x-(--sidebar-translation) md:col-start-2">
                {header}
                {breadcrumbs}
                <div className="max-content-widest mx-auto grid gap-y-4">
                  {ticketForm}
                  {tickets}
                  {comments}
                </div>
                {children}
              </main>
            </div>
            {auth}
            <Toaster expand />
          </MobileSidebarProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </body>
  </html>
);

export default RootLayout;
