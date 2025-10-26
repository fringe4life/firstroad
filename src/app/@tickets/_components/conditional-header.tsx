import Heading from "@/components/heading";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";

// Conditional header component using HasAuthSuspense
export const ConditionalHeader = () => (
  <HasAuthSuspense
    fallback={<div className="h-16 animate-pulse rounded-lg bg-muted" />}
  >
    {(session) => {
      if (session?.user) {
        return (
          <Heading
            description="All your tickets at one place"
            title="My Tickets"
          />
        );
      }

      return (
        <Heading
          description="Tickets by everyone at one place"
          title="All Tickets"
        />
      );
    }}
  </HasAuthSuspense>
);
