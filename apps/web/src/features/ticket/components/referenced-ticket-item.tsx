import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { ticketPath } from "@/path";
import type { ReferencedTicketItemProps } from "../types";

const ReferencedTicketItem = ({
  referencedTicket,
}: ReferencedTicketItemProps) => (
  <Link
    className="flex items-center gap-x-2 text-sm"
    href={ticketPath(referencedTicket.slug)}
  >
    <LucideArrowUpRightFromSquare className="aspect-square h-4" />
    {referencedTicket.title}
  </Link>
);

export { ReferencedTicketItem };
