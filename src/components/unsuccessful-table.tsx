import { Placeholder, type PlaceholderProps } from "@/components/placeholder";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface UnsuccessfulTableProps extends PlaceholderProps {
  colSpan: number;
}

const UnsuccessfulTable = ({
  colSpan,
  ...placeholderProps
}: UnsuccessfulTableProps) => {
  return (
    <TableBody className="h-full">
      <TableRow>
        <TableCell colSpan={colSpan}>
          <Placeholder {...placeholderProps} />
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export { UnsuccessfulTable };
