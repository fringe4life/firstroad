import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import Header from "@/app/_navigation/header";
import Sidebar from "@/app/_navigation/sidebar/components/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<NuqsAdapter>
					<SessionProvider>
						<ThemeProvider>
							<Header />
							<div className="flex h-screen overflow-hidden border-collapse">
								<Sidebar />
								<main className="flex flex-col flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-8 py-24">
									{children}
								</main>
							</div>
							<Toaster expand />
						</ThemeProvider>
					</SessionProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
