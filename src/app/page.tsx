import type { SearchParams } from "nuqs/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";

export const metadata: Metadata = {
	title: "All Tickets | First Road",
	description: "Browse and discover all tickets from the community. Find opportunities, share knowledge, and collaborate with others.",
};

const HomePage = async ({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) => {
	return (
		<div className="flex flex-col gap-y-8">
			<Heading
				title="All Tickets"
				description="Tickets by everyone at one place"
			/>
			<Suspense fallback={<Spinner />}>
				<TicketList searchParams={searchParams} />
			</Suspense>
		</div>
	);
};

export default HomePage;
