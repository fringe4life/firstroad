"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteTicket = async (id: string) => {
	const session = await getSessionOrRedirect();

	const { error } = await tryCatch(async () => {
		await prisma.$transaction(async (tx) => {
			const ticket = await tx.ticket.findUnique({
				where: {
					id,
				},
			});

			if (!ticket || !isOwner(session, ticket)) {
				throw new Error("Ticket Not Found");
			}

			await tx.ticket.delete({ where: { id } });
		});
	});

	if (error) {
		return fromErrorToActionState(error);
	}

	revalidatePath(ticketsPath);
	setCookieByKey("toast", "Ticket deleted");
	redirect(ticketsPath);
};
