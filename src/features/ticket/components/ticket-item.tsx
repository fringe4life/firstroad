import type { Prisma } from "@prisma/client";
import clsx from "clsx";
import {
	LucideMoreVertical,
	LucidePencil,
	SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TICKET_ICONS } from "@/features/constants";
import { ticketEditPath, ticketPath } from "@/path";
import { toCurrencyFromCent } from "@/utils/currency";
import { isOwner } from "@/features/auth/utils/owner";
import Comments from "@/features/comment/components/comments";
import { getComments } from "@/features/comment/queries/get-comments";
import TicketMoreMenu from "@/features/ticket/components/ticket-more-menu";

export type TicketItemProps = {
	ticket: Prisma.TicketGetPayload<{
		include: {
			userInfo: {
				include: {
					user: {
						select: {
							name: true;
						};
					};
				};
			};
		};
	}>;
	isDetail?: boolean;
};
const TicketItem = async ({ ticket, isDetail = false }: TicketItemProps) => {
	const session = await auth();
	const comments = isDetail ? await getComments(ticket.id) : [];

	const isTicketOwner = isOwner(session, ticket);

	const detailButton = (
		<Button variant="outline" size="icon" asChild>
			<Link prefetch href={ticketPath(ticket.id)}>
				<SquareArrowOutUpRight className="size-4" />
			</Link>
		</Button>
	);

	const editButton = isTicketOwner ? (
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

	const moreMenu = isTicketOwner ? (
		<TicketMoreMenu ticket={ticket} trigger={trigger} />
	) : null;

	return (
		<div className={clsx("w-full   grid gap-y-4", {
			"max-w-120": isDetail,
			"max-w-105": !isDetail,
		})}>
		<div className="flex gap-x-2">
			<Card className="w-full overflow-hidden">
				<CardHeader>
					<CardTitle className="flex gap-x-2 items-center">
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
					<p className="text-sm text-muted-foreground">
						{ticket.deadline.toLocaleDateString()} by{" "}
						{ticket.userInfo.user.name}
					</p>
					<p className="text-sm text-muted-foreground">
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
			{isDetail ? <Comments ticketId={ticket.id} comments={comments} /> : null}
		</div>
	);
};

export default TicketItem;
