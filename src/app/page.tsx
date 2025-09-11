import type { Metadata } from "next";
import Heading from "@/components/heading";

export const metadata: Metadata = {
	title: "All Tickets",
	description:
		"View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
};

const HomePage = () => {
	return (
		<Heading
			title="All Tickets"
			description="Tickets by everyone at one place"
		/>
	);
};

export default HomePage;
