import { getSessionOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import TicketList from "@/features/ticket/components/ticket-list";

export default async function Tickets({ searchParams }: PageProps<"/tickets">) {
  const session = await getSessionOrRedirect();

  return (
    <div className="flex flex-1 flex-col items-center gap-y-4">
      <TicketList userId={session.user.id} searchParams={searchParams} />
    </div>
  );
}
