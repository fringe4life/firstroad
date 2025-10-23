import { ViewTransition } from "react";
import TicketList from "@/features/ticket/components/ticket-list";

const Tickets = () => (
  <div className="grid items-center gap-y-4">
    <ViewTransition>
      <TicketList />
    </ViewTransition>
  </div>
);

export default Tickets;
