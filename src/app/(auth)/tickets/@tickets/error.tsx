"use client";

import { useEffect } from "react";
import Placeholder from "@/components/placeholder";

export default function TicketError({
	error,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return <Placeholder label={"please try again later"} />;
}
