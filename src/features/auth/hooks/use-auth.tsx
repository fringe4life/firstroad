"use client";

import { authClient } from "@/lib/auth-client";

const useAuth = () => {
	const { data: session, isPending, error } = authClient.useSession();

	return {
		user: session?.user ?? null,
		session: session,
		isFetched: !isPending,
		isLoading: isPending,
		error,
	};
};

export default useAuth;
