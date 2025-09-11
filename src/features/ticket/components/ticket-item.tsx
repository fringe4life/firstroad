"use server";
import clsx from "clsx";
import {
	LucideMoreVertical,
	LucidePencil,
	SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Comments from "@/features/comment/components/comments";
import type { Comment } from "@/features/comment/types";
import { TICKET_ICONS } from "@/features/constants";
import TicketMoreMenu from "@/features/ticket/components/ticket-more-menu";
import type { BaseTicket } from "@/features/ticket/types";
import type { PaginatedResult } from "@/features/types/pagination";
import { ticketEditPath, ticketPath } from "@/path";
import { toCurrencyFromCent } from "@/utils/currency";

// List view props (isDetail: false)
type TicketItemListProps = {
	isDetail: false;
	ticket: BaseTicket;
};

// Detail view props (isDetail: true)
type TicketItemDetailProps = {
	isDetail: true;
	ticket: BaseTicket & PaginatedResult<Comment>;
};

// Discriminated union type
type TicketItemProps = TicketItemListProps | TicketItemDetailProps;

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
	const detailButton = (
		<Button variant="outline" size="icon" asChild>
			<Link prefetch href={ticketPath(ticket.id)}>
				<SquareArrowOutUpRight className="size-4" />
			</Link>
		</Button>
	);

	const editButton = ticket.isOwner ? (
		<Button variant="outline" size="icon" asChild>
			<Link prefetch href={ticketEditPath(ticket.id)}>
				<LucidePencil className="size-4" />
			</Link>
		</Button>
	) : null;

	const trigger = (
		<Button variant="outline" size="icon">
			<LucideMoreVertical className="size-4" />
		</Button>
	);

	const moreMenu = ticket.isOwner ? (
		<TicketMoreMenu ticket={ticket} trigger={trigger} />
	) : null;

	return (
		<div
			className={clsx("grid w-full gap-y-4", {
				"max-w-120": isDetail,
				"max-w-105": !isDetail,
			})}
		>
			<div className="flex gap-x-2">
				<Card className="w-full overflow-hidden">
					<CardHeader>
						<CardTitle className="flex items-center gap-x-2">
							<span>{TICKET_ICONS[ticket.status]}</span>
							<span className="truncate">{ticket.title}</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<span
							className={clsx("whitespace-break-spaces", {
								"line-clamp-3": !isDetail,
							})}
						>
							{ticket.description}
						</span>
					</CardContent>
					<CardFooter className="flex justify-between">
						<p className="text-muted-foreground text-sm">
							{ticket.deadline.toLocaleDateString()} by{" "}
							{ticket.userInfo.user.name}
						</p>
						<p className="text-muted-foreground text-sm">
							{toCurrencyFromCent(ticket.bounty)}
						</p>
					</CardFooter>
				</Card>

				<div className="flex flex-col gap-y-1">
					{isDetail ? (
						<>
							{editButton}
							{moreMenu}
						</>
					) : (
						<>
							{detailButton}
							{editButton}
						</>
					)}
				</div>
			</div>
			{isDetail && (
				<Comments
					ticketId={ticket.id}
					list={ticket.list}
					metadata={ticket.metadata}
				/>
			)}
		</div>
	);
};

export default TicketItem;
