"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, useState } from "react";
import AccountDropdown from "@/app/_navigation/account-dropwdown";
import { navItems } from "@/app/_navigation/sidebar/constants";
import { useMobileSidebar } from "@/app/_navigation/sidebar/context";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import useAuth from "@/features/auth/hooks/use-auth";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { signInPath, signUpPath } from "@/path";

const Sidebar = () => {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { isFetched, user } = useAuth();
	const { isOpen: isMobileOpen, close } = useMobileSidebar();

	console.log({ user, isFetched });

	// Desktop sidebar - hidden by default, only visible on md and above
	if (isDesktop) {
		return (
			<nav
				className={cn(
					"hidden h-screen border-r pt-24 transition-all duration-200 md:block",
					isOpen ? "w-60" : "w-19.5",
				)}
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
			>
				<div className="px-3 py-2">
					<nav className="space-y-2">
						{navItems.map((item) => {
							const isAccountItem = item.href.startsWith("/account");
							const isActive = isAccountItem
								? pathname.startsWith("/account")
								: pathname === item.href;

							return (
								<div key={item.title}>
									{item.seperator && <Separator />}
									<Link
										href={item.href}
										className={cn(
											buttonVariants({ variant: "ghost" }),
											"group relative flex h-12 w-full justify-start",
											isActive && "bg-muted font-bold hover:bg-muted",
										)}
									>
										{cloneElement(item.icon, {
											className: "w-5 aspect-square",
										} as React.HTMLAttributes<HTMLElement>)}
										<span
											className={cn(
												"absolute left-12 text-base duration-200",
												isOpen ? "opacity-100" : "opacity-0",
											)}
										>
											{item.title}
										</span>
									</Link>
								</div>
							);
						})}
					</nav>
				</div>
			</nav>
		);
	}

	// Mobile sidebar - Sheet that slides in from left
	return (
		<Sheet open={isMobileOpen} onOpenChange={close}>
			<SheetContent side="left" className="w-80 p-0">
				<SheetHeader className="border-b px-6 py-4">
					<SheetTitle>Navigation</SheetTitle>
				</SheetHeader>
				<div className="px-3 py-2">
					<nav className="space-y-2">
						{navItems.map((item) => {
							const isAccountItem = item.href.startsWith("/account");
							const isActive = isAccountItem
								? pathname.startsWith("/account")
								: pathname === item.href;

							return (
								<div key={item.title}>
									{item.seperator && <Separator />}
									<Link
										href={item.href}
										className={cn(
											buttonVariants({ variant: "ghost" }),
											"group relative flex h-12 w-full justify-start",
											isActive && "bg-muted font-bold hover:bg-muted",
										)}
										onClick={close}
									>
										{cloneElement(item.icon, {
											className: "w-5 aspect-square",
										} as React.HTMLAttributes<HTMLElement>)}
										<span className="ml-3 text-base">{item.title}</span>
									</Link>
								</div>
							);
						})}

						{/* Auth section for mobile */}
						{!isFetched ? null : user ? (
							<div className="pt-4">
								<Separator />
								<div className="px-3 py-2">
									<AccountDropdown user={user} />
								</div>
							</div>
						) : (
							<div className="pt-4">
								<Separator />
								<div className="flex flex-col gap-2 px-3 py-2">
									<Link
										className={buttonVariants({ variant: "outline" })}
										href={signUpPath}
										onClick={close}
									>
										Sign Up
									</Link>
									<Link
										className={buttonVariants({ variant: "default" })}
										href={signInPath}
										onClick={close}
									>
										Sign In
									</Link>
								</div>
							</div>
						)}
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default Sidebar;
