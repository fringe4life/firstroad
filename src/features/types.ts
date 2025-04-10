export type TICKET = {
  id: string;
  title: string;
  content: string;
  status: STATUS;
};

export type TicketItemProps = {
  ticket: TICKET;
  isDetail?: boolean;
};

export type STATUS = "IN_PROGRESS" | "OPEN" | "DONE";
