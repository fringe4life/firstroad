
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/app/auth";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";

const TicketsPage = async ({ searchParams }: PageProps<"/tickets">) => {
	const session = await auth();

	return (
		<div className="flex-1 flex flex-col gap-y-8">
			<Heading title="My Tickets" description="All your tickets at one place" />
			<CardCompact
				className="w-full max-w-105 self-center"
				title="Create Ticket"
				description="A new ticket will be created"
				content={<TicketUpsertForm />}
			/>
			<div className="flex-1 flex flex-col items-center gap-y-4">
				<ErrorBoundary
					fallback={<Placeholder label={"please try again later"} />}
				>
					<Suspense fallback={<Spinner />}>
						<TicketList
							userId={session?.user?.id}
							searchParams={searchParams}
						/>
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	);
};

export default TicketsPage;
