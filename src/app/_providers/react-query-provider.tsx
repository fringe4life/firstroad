"use client";

import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import type * as React from "react";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
};

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
	if (isServer) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
};

export const ReactQueryProvider = (props: { children: React.ReactNode }) => {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>
				{props.children}
			</ReactQueryStreamedHydration>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};
