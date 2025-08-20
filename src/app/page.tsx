import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import Heading from "@/components/heading";
import Spinner from "@/components/Spinner";
import TicketList from "@/features/ticket/ticket-list";

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
