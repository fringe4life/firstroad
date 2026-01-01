import { cacheLife } from "next/cache";
import type { SearchParams } from "nuqs/server";
import { Heading } from "@/components/heading";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { searchParamsCache } from "@/features/ticket/search-params";

interface HeaderPageProps {
  searchParams?: Promise<SearchParams>;
}

const HeaderPage = ({ searchParams }: HeaderPageProps) => (
  <HasAuthSuspense
    fallback={
      <div className="h-(--heading-height) animate-pulse rounded-lg bg-muted" />
    }
  >
    {async (user) => {
      const resolvedSearchParams =
        searchParams instanceof Promise ? await searchParams : {};
      const { scope } = searchParamsCache.parse(resolvedSearchParams);
      if (Boolean(user) && scope === "mine") {
        return <MyTicketsHeading />;
      }

      return <AllTicketsHeading />;
    }}
  </HasAuthSuspense>
);

const AllTicketsHeading = async () => {
  "use cache";
  cacheLife("max");
  return (
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
  );
};

const MyTicketsHeading = async () => {
  "use cache";
  cacheLife("max");
  return (
    <Heading description="All your tickets at one place" title="My Tickets" />
  );
};
export default HeaderPage;
