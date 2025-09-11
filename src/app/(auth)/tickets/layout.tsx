import { RedirectToast } from "@/components/redirect-toast";

export default function TicketsLayout({
	children,
	tickets,
}: LayoutProps<"/tickets">) {
	return (
		<>
			{children}
			{tickets}
			<RedirectToast />
		</>
	);
}
