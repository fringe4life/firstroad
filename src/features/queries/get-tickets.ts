import type { Prisma } from "@prisma/client";
import type { SearchParams } from "nuqs/server";
import { prisma } from "@/lib/prisma";
import { searchParamsCache } from "../ticket/search-params";

export const getTickets = async (
	userId?: string,
	searchParams?: Promise<SearchParams>,
) => {
	const { search, sort } = searchParams
		? await searchParamsCache.parse(searchParams)
		: { search: "", sort: "newest" };

	// Build orderBy based on sort parameter
	let orderBy: Prisma.TicketOrderByWithRelationInput = { createdAt: "desc" }; // default

	if (sort === "bounty") {
		orderBy = { bounty: "desc" };
	}

	return await prisma.ticket.findMany({
		where: {
			userId: userId,
			...(search && {
				title: {
					contains: search,
					mode: "insensitive",
				},
			}),
		},
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
	});
};
