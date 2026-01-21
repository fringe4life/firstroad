import { format } from "date-fns";
import { LucideBan, LucideCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { MembershipItemProps } from "../types";

const MembershipItem = ({ member }: MembershipItemProps) => (
  <TableRow>
    <TableCell>{member.name}</TableCell>
    <TableCell>{member.email}</TableCell>
    <TableCell>{format(member.joinedAt, "dd/MM/yyyy, HH:mm")}</TableCell>
    <TableCell>
      {member.emailVerified ? <LucideCheck /> : <LucideBan />}
    </TableCell>
    <TableCell>
      <Button>Todo</Button>
    </TableCell>
  </TableRow>
);

export { MembershipItem };
