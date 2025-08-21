import type { Prisma } from "@prisma/client";
import type { SearchParams } from "nuqs/server";
import { prisma } from "@/lib/prisma";
import { searchParamsCache } from "@/features/ticket/search-params";

export const getTickets = async (
	userId?: string,
	searchParams?: Promise<SearchParams>,
) => {
	const { search, sortKey, sortValue, page, limit } = searchParams
		? await searchParamsCache.parse(searchParams)
		: { search: "", sortKey: "createdAt", sortValue: "desc" as string };

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

	return await prisma.ticket.findMany({
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
		take: limit,
		skip: (page ?? 0) * (limit ?? 2)
	});
};
