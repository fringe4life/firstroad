import { connection } from "next/server";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import TicketList from "@/features/ticket/components/ticket-list";

export default async function Tickets({ searchParams }: PageProps<"/tickets">) {
  await connection();
  const session = await getSessionOrRedirect();

  return (
    <div className="flex flex-1 flex-col items-center gap-y-4">
      <TicketList searchParams={searchParams} userId={session.user.id} />
    </div>
  );
}
