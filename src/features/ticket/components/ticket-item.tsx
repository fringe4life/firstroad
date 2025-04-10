import clsx from "clsx";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketPath } from "@/path";
import { TICKET_ICONS } from "../../constants";
import { type TicketItemProps } from "../../types";
const TicketItem = ({
  ticket: { title, content, status, id },
  isDetail = false,
}: TicketItemProps) => {
  const detailButton = (
    <Button variant="outline" size="icon" asChild>
      <Link href={ticketPath(id)}>
        <SquareArrowOutUpRight className="size-4" />
      </Link>
    </Button>
  );
  return (
    <div
      className={clsx("w-full   flex gap-x-1", {
        "max-w-[480px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="flex gap-x-2 items-center">
            <span>{TICKET_ICONS[status]}</span>
            <span className="truncate">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span
            className={clsx("whitespace-break-spaces", {
              "line-clamp-3": !isDetail,
            })}
          >
            {content}
          </span>
        </CardContent>
      </Card>

      {!isDetail ? (
        <div className="flex flex-col gap-y-1"> {detailButton}</div>
      ) : null}
    </div>
  );
};

export default TicketItem;
