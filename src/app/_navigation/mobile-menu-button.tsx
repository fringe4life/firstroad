"use client";

import { Menu } from "lucide-react";
import { useMobileSidebar } from "@/app/_navigation/sidebar/context";
import { Button } from "@/components/ui/button";

const MobileMenuButton = () => {
	const { open } = useMobileSidebar();
	return (
		<Button variant="ghost" size="icon" className="md:hidden" onClick={open}>
			<Menu className="h-5 w-5" />
			<span className="sr-only">Open navigation menu</span>
		</Button>
	);
};

export default MobileMenuButton;
