import { NextRequest } from "next/server";
import { getTickets } from "@/features/ticket/queries/get-tickets";
import { searchParamsCache } from "@/features/ticket/search-params";

export const GET = async (request: NextRequest) => {
  const searchParams = searchParamsCache.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  console.log({ searchParams });

  //   const tickets = await getTickets(request.nextUrl.searchParams);
};
