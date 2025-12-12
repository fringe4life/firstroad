import TicketList from "@/features/ticket/components/ticket-list";
import type { SearchParamsProps } from "@/types";

const TicketsPage = ({ searchParams }: SearchParamsProps) => (
  <TicketList searchParams={searchParams} />
);
export default TicketsPage;
