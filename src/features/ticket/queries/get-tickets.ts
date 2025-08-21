import type { Prisma } from "@prisma/client";
import type { SearchParams } from "nuqs/server";
import { prisma } from "@/lib/prisma";
import { searchParamsCache } from "@/features/ticket/search-params";

export const getTickets = async (
	searchParams: Promise<SearchParams>,
	userId?: string,
) => {
	const { search, sortKey, sortValue, page, limit } =  await searchParamsCache.parse(searchParams);

	// Build orderBy based on sort parameter
	let orderBy: Prisma.TicketOrderByWithRelationInput = {
		createdAt: sortValue as Prisma.SortOrder,
	}; // default

	if (sortKey === "bounty") {
		orderBy = { bounty: sortValue as Prisma.SortOrder };
	}

	const  where: Prisma.TicketWhereInput = {
		userId: userId,
		title: {
			contains: search,
			mode: "insensitive",
		},
	};

	const skip = page * limit
	const take = limit

	const [tickets, count] = await prisma.$transaction([
		prisma.ticket.findMany({
			where,
			include: {
				userInfo: {
					include: {
						user: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			orderBy,
			take,
			skip,
		}),
		prisma.ticket.count({ where, orderBy }),
	])

	return {
		list: tickets,
		metadata: {
			count,
			hasNextPage: count > skip + take
		}
	}
};
