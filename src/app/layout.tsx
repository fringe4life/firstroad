import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { auth } from "./auth";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Road",
  description: "A guided Nextjs Journey",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider>
            <Header />
            <main className=" flex flex-col flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-8 py-24">
              {children}
            </main>
            <Toaster expand />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
