import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import Header from "@/app/_navigation/header";
import Sidebar from "@/app/_navigation/sidebar/components/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ReactQueryProvider } from "@/app/_providers/react-query-provider";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "First Road",
		template: "%s | First Road",
	},
	description: "A collaborative platform for creating and managing tickets. Connect with developers, share knowledge, and build amazing projects together.",
	keywords: ["tickets", "collaboration", "development", "projects", "community"],
	authors: [{ name: "First Road Team" }],
	creator: "First Road",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://firstroad.com",
		title: "First Road",
		description: "A collaborative platform for creating and managing tickets. Connect with developers, share knowledge, and build amazing projects together.",
		siteName: "First Road",
	},
};

export default async function RootLayout({
	children,
}: LayoutProps<"/">) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<NuqsAdapter>
					<SessionProvider>
						<ThemeProvider>
							<ReactQueryProvider>
								<Header />
								<div className="flex h-screen overflow-hidden border-collapse">
									<Sidebar />
									<main className="flex flex-col flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-8 py-24">
										{children}
									</main>
								</div>
								<Toaster expand />
							</ReactQueryProvider>
						</ThemeProvider>
					</SessionProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
