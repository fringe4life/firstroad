import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrganisationById } from "@/features/organisation/queries/get-organisation-by-id";

const OrganisationDetailPage = async ({
  params,
}: PageProps<"/organisations/[id]">) => {
  const { id } = await params;
  const members = await getOrganisationById(id);
  if (!members) {
    notFound();
  }

  return (
    <Table className="h-full">
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>
              <Placeholder label="No members found" />
            </TableCell>
          </TableRow>
        ) : (
          members.map((member) => (
            <TableRow key={member.email}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                {format(member.joinedAt, "dd/MM/yyyy, HH:mm")}
              </TableCell>
              <TableCell>{member.emailVerified ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default OrganisationDetailPage;
