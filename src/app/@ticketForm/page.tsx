import { CardCompact } from "@/components/card-compact";
import { getSession } from "@/features/auth/queries/get-session";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";

const TicketFormPage = async () => {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  return (
    <CardCompact
      className="max-content-narrow self-center"
      content={<TicketUpsertForm upsertTicketAction={upsertTicket} />}
      description="A new ticket will be created"
      title="Create Ticket"
    />
  );
};

export default TicketFormPage;
