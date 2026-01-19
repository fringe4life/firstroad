import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { MembershipItemProps } from "../types";

const MembershipItem = ({ member }: MembershipItemProps) => (
  <TableRow>
    <TableCell>{member.name}</TableCell>
    <TableCell>{member.email}</TableCell>
    <TableCell>{format(member.joinedAt, "dd/MM/yyyy, HH:mm")}</TableCell>
    <TableCell>{member.emailVerified ? "Yes" : "No"}</TableCell>
  </TableRow>
);

export { MembershipItem };
