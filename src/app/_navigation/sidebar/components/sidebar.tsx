"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import useAuth from "@/features/auth/hooks/use-auth"
import { navItems } from "../constants"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cloneElement } from "react"

export const dynamic = "force-dynamic";

const Sidebar = () => {
	const { isFetched, user } = useAuth()
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	if (!isFetched) return <div className="w-19.5 bg-secondary/20" />

	// Show All Tickets for everyone; show My Tickets (and Account) only if logged in
	const filteredNavItems = navItems.filter((item) => {
		if (item.title === "All Tickets") return true
		if (item.title === "My Tickets") return !!user
		if (item.title === "Account") return !!user
		return true
	})

	const handleMouseEnter = () => setIsOpen(true)
	const handleMouseLeave = () => setIsOpen(false)

	return (
		<nav
			className={cn(
				"h-screen border-r pt-24 transition-all duration-200",
				isOpen ? "w-60" : "w-19.5"
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className="px-3 py-2">
				<nav className="space-y-2">
					{filteredNavItems.map((item) => {
						const isAccountItem = item.href.startsWith("/account")
						const isActive = isAccountItem
							? pathname.startsWith("/account")
							: pathname === item.href

						return (
							<div key={item.title}>
								{item.seperator && <Separator />}
								<Link
									href={item.href }
									className={cn(
										buttonVariants({ variant: "ghost" }),
										"group relative flex h-12 justify-start w-full",
										isActive && "bg-muted font-bold hover:bg-muted"
									)}
								>
									{cloneElement(item.icon, {
										className: "w-5 aspect-square",
									} as React.HTMLAttributes<HTMLElement>)}
									<span
										className={cn(
											"absolute left-12 text-base duration-200",
											isOpen ? "opacity-100" : "opacity-0"
										)}
									>
										{item.title}
									</span>
								</Link>
							</div>
						)
					})}
				</nav>
			</div>
		</nav>
	)
}

export default Sidebar