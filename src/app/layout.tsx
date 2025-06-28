import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme/theme-provider";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Road",
  description: "A guided Nextjs Journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Header />
          <main className=" flex flex-col flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-8 py-24">
            {children}
          </main>
          <Toaster expand />

         
        </ThemeProvider>
      </body>
    </html>
  );
}
